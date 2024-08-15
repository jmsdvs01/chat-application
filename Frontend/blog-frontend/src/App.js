import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState('16px');
  const [isBold, setIsBold] = useState(false);

  // Fetch all posts when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/posts').then((response) => {
      setPosts(response.data.posts);
    });
  }, []);

  // Function to add a new blog post
  const addPost = () => {
    axios
      .post('http://localhost:3001/posts', {
        title,
        content,
        completed: false,
      })
      .then((response) => {
        setPosts([...posts, { id: response.data.postId, title, content, completed: false }]);
        setTitle('');
        setContent('');
      });
  };

  // Function to delete a blog post
  const deletePost = (id) => {
    axios.delete(`http://localhost:3001/posts/${id}`).then(() => {
      setPosts(posts.filter((post) => post.id !== id));
      setSelectedPost(null); // Clear the displayed post if it's deleted
    });
  };

  // Function to mark post as completed
  const completePost = (id, completed) => {
    axios.put(`http://localhost:3001/posts/${id}`, { completed: !completed }).then(() => {
      setPosts(posts.map((post) =>
        post.id === id ? { ...post, completed: !post.completed } : post
      ));
    });
  };

  // Function to display the selected post in the main content area
  const displayPost = (post) => {
    setSelectedPost(post);
  };

  // Function to toggle bold formatting
  const toggleBold = () => {
    setIsBold(!isBold);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>My Blog</h1>
        
        <div className="new-post">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              fontFamily: font,
              fontSize: fontSize,
              fontWeight: isBold ? 'bold' : 'normal',
            }}
          />
          <div className="formatting-options">
            <label htmlFor="font-select">Font: </label>
            <select id="font-select" value={font} onChange={(e) => setFont(e.target.value)}>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>

            <label htmlFor="font-size-select">Font Size: </label>
            <select id="font-size-select" value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
              <option value="12px">12px</option>
              <option value="16px">16px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
              <option value="28px">28px</option>
            </select>

            <button onClick={toggleBold} className={isBold ? 'active' : ''}>
              Bold
            </button>
          </div>
          <button onClick={addPost}>Add Post</button>
        </div>

        <div className="blog-layout">
          {/* Sidebar */}
          <div className="sidebar">
            <h2>Blog Titles</h2>
            {posts.map((post) => (
              <div 
                className={`sidebar-item ${post.completed ? 'completed' : ''}`} 
                key={post.id} 
                onClick={() => displayPost(post)}>
                {post.title}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="main-content">
            {selectedPost ? (
              <div className={`post ${selectedPost.completed ? 'completed' : ''}`}>
                <h2>{selectedPost.title}</h2>
                <p>{selectedPost.content}</p>
                <button onClick={() => completePost(selectedPost.id, selectedPost.completed)}>
                  {selectedPost.completed ? 'Unmark as Completed' : 'Mark as Completed'}
                </button>
                <button onClick={() => deletePost(selectedPost.id)}>Delete Post</button>
              </div>
            ) : (
              <p>Select a post from the sidebar to read.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
