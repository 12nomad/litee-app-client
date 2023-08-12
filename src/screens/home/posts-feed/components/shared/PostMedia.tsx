interface IPostMedia {
  media: string;
  username: string;
  createdAt: Date;
}

const PostMedia = ({ createdAt, media, username }: IPostMedia) => {
  return (
    <div className="mt-4">
      <img
        src={media}
        alt={username + createdAt.toLocaleString()}
        className="w-full h-52 md:h-96 object-cover rounded-md"
      />
    </div>
  );
};

export default PostMedia;
