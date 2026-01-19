import { useEffect, useState, type JSX } from "react";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";

/**
 * Editable user profile fields returned by GET /user/me
 */
type UserProfile = {
  name: string;
  bio?: string;
  homeBanner?: string;
  profilePicture?: string;
  contactEmail?: string;
  instagram?: string;
  substack?: string;
  location?: string;
};

/**
 * Editable user info table with a single Save button
 */
export default function UserInfoTable(): JSX.Element {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  /**
   * Fetch authenticated user profile
   */
  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const response: AxiosResponse<UserProfile> =
          await api.get<UserProfile>("/user/me");
        setProfile(response.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /**
   * Update local state only
   */
  const updateField = (
    field: keyof UserProfile,
    value: string
  ): void => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  /**
   * Persist all profile changes
   */
  const saveProfile = async (): Promise<void> => {
    if (!profile) return;

    setIsSaving(true);
    try {
      await api.patch("/user/me", profile);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return <div className="text-sm p-4">Loading user info…</div>;
  }

  return (
    <section className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium">User Info</h2>

        <button
          type="button"
          onClick={saveProfile}
          disabled={isSaving}
          className="text-xs underline underline-offset-4 disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>

      <table className="w-full text-sm">
        <tbody>
          <EditableRow
            label="Name"
            value={profile.name}
            onChange={(value) =>
              updateField("name", value)
            }
          />
          <EditableRow
            label="Home Banner"
            value={profile.homeBanner}
            onChange={(value) =>
              updateField("homeBanner", value)
            }
          />
          <EditableRow
            label="Bio"
            value={profile.bio}
            textarea
            onChange={(value) =>
              updateField("bio", value)
            }
          />
          <EditableRow
            label="Profile Picture"
            value={profile.profilePicture}
            textarea
            onChange={(value) =>
              updateField("profilePicture", value)
            }
          />
          <EditableRow
            label="Location"
            value={profile.location}
            onChange={(value) =>
              updateField("location", value)
            }
          />
          <EditableRow
            label="Contact Email"
            value={profile.contactEmail}
            onChange={(value) =>
              updateField("contactEmail", value)
            }
          />
          <EditableRow
            label="Instagram"
            value={profile.instagram}
            onChange={(value) =>
              updateField("instagram", value)
            }
          />
          <EditableRow
            label="Substack"
            value={profile.substack}
            onChange={(value) =>
              updateField("substack", value)
            }
          />
        </tbody>
      </table>
    </section>
  );
}

/* ───────────────────────────────────────────── */

type EditableRowProps = {
  label: string;
  value?: string;
  textarea?: boolean;
  onChange: (value: string) => void;
};

/**
 * Reusable editable table row
 */
function EditableRow({
  label,
  value,
  textarea = false,
  onChange,
}: EditableRowProps): JSX.Element {
  return (
    <tr className="border-b last:border-b-0">
      <td className="py-1 pr-2 w-32 text-gray-500 align-top">
        {label}
      </td>
      <td className="py-1">
        {textarea ? (
          <textarea
            rows={3}
            className="w-full resize-none bg-transparent outline-none"
            value={value ?? ""}
            onChange={(event) =>
              onChange(event.target.value)
            }
          />
        ) : (
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            value={value ?? ""}
            onChange={(event) =>
              onChange(event.target.value)
            }
          />
        )}
      </td>
    </tr>
  );
}
