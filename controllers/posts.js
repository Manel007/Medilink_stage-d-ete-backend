import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, title,description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstname,
      lastName: user.lastname,
      title,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find().sort({ updatedAt: -1 });
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */




export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId
    const user = await User.findById(userId).populate('Friends');
    if (!user) return res.status(404).json({ msg: "User not found." });

    // Retrieve lastSavedPostCreatedAt from the user
    let lastSavedPostCreatedAt = user.lastSavedPostCreatedAt;

    // Get friends' userIds
    const friendsIds = user.Friends.map(friend => friend._id);

    // Retrieve posts from friends
    let friendsPostsQuery = Post.find({ userId: { $in: friendsIds } }).sort({ createdAt: -1 })

    // Retrieve posts from non-friends
    let nonFriendsPostsQuery = Post.find({ userId: { $nin: friendsIds } }).sort({ createdAt: -1 })

    // Modify queries to fetch posts after lastSavedPostCreatedAt
    if (lastSavedPostCreatedAt) {
      friendsPostsQuery = Post.find({ userId: { $in: friendsIds }, createdAt: { $gt: lastSavedPostCreatedAt } }).sort({ createdAt: -1 })
      nonFriendsPostsQuery = Post.find({ userId: { $nin: friendsIds }, createdAt: { $gt: lastSavedPostCreatedAt } }).sort({ createdAt: -1 })
    }

    // Execute queries
    const friendsPosts = await friendsPostsQuery;
    const nonFriendsPosts = await nonFriendsPostsQuery;
     // Combine results, prioritizing friends' posts
     let posts = [...nonFriendsPosts]
if (friendsPosts.length > 0){
   
     posts = [...friendsPosts, ...nonFriendsPosts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
  }
    // Update lastSavedPostCreatedAt to the most recent post's createdAt if there are any posts retrieved
    if (posts.length > 0) {
      lastSavedPostCreatedAt = posts[0].createdAt;

      // Save lastSavedPostCreatedAt to the user document
      user.lastSavedPostCreatedAt = lastSavedPostCreatedAt;
      await user.save();
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error retrieving posts:", err.message);
    res.status(500).json({ error: err.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};