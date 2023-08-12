interface IProfileImage {
  src?: string;
  size: number;
}

const ProfileImage = ({ size, src }: IProfileImage) => {
  return src ? (
    <img
      src={src}
      alt="user avatar"
      className={`w-${size} h-${size} object-cover rounded-full`}
    />
  ) : (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
      alt="user avatar"
      className={`w-${size} h-${size} object-cover rounded-full`}
    />
  );
};

export default ProfileImage;
