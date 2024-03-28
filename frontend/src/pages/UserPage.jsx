import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost
        likes="123"
        replies="456"
        postImage="/post1.png"
        postTitle="My Podcast is online"
      />
      <UserPost
        likes="789"
        replies="123"
        postImage="/post2.png"
        postTitle="My Second Post"
      />
      <UserPost
        likes="456"
        replies="789"
        postImage="/post3.png"
        postTitle="Hello World!"
      />
      <UserPost
        likes="100"
        replies="19"
        postTitle="A new post without an image"
      />
    </>
  );
};

export default UserPage;
