const avatarThemes = {
  'profile-01': 'rose',
  'profile-02': 'blue',
  'profile-03': 'purple',
  'profile-04': 'green',
  'profile-05': 'orange',
  'profile-06': 'blue',
  'profile-07': 'rose',
  'profile-08': 'purple',
};

function ProfileCard({ profile, position, total }) {
  const theme = avatarThemes[profile.id] || 'purple';

  return (
    <article
      className="profile-card"
      aria-label={`${profile.name}, ${profile.age}`}
    >
      <div className={`profile-avatar avatar-${theme}`}>
        <span className="profile-position">
          {String(position).padStart(2, '0')} /{' '}
          {String(total).padStart(2, '0')}
        </span>

        <div className="avatar-decoration" aria-hidden="true" />

        <svg
          className="avatar-illustration"
          viewBox="0 0 240 260"
          aria-hidden="true"
        >
          <circle
            cx="120"
            cy="100"
            r="76"
            fill="currentColor"
            opacity="0.12"
          />

          <path
            d="M27 260 C27 175 67 155 120 155
               C173 155 213 175 213 260 Z"
            fill="#ffffff"
            opacity="0.72"
          />

          <rect
            x="99"
            y="130"
            width="42"
            height="54"
            rx="19"
            fill="#d8a18d"
          />

          <ellipse
            cx="120"
            cy="99"
            rx="53"
            ry="67"
            fill="#f1c6b3"
          />

          <path
            d="M67 100 C45 36 83 15 122 15
               C167 15 192 49 173 100
               C158 67 128 67 110 42
               C94 69 83 78 67 100 Z"
            fill="#403145"
          />

          <circle cx="100" cy="105" r="4" fill="#403145" />
          <circle cx="140" cy="105" r="4" fill="#403145" />

          <path
            d="M109 131 Q120 139 131 131"
            fill="none"
            stroke="#ad6972"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <span className="avatar-initial" aria-hidden="true">
          {profile.name.charAt(0)}
        </span>
      </div>

      <div className="profile-details">
        <p className="profile-label">DISCOVER</p>

        <h2>
          {profile.name}, {profile.age}
        </h2>

        <p className="profile-bio">{profile.bio}</p>

        <span className="fictional-label">
          <span aria-hidden="true">●</span>
          {' '}Fictional demo profile
        </span>
      </div>
    </article>
  );
}

export default ProfileCard;