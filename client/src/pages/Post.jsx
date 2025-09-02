import React, { useState, useEffect } from "react";
import "./Post.css"; // Import the CSS file

const API_URL = "http://127.0.0.1:8000/api/posts/";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(
          `Failed to fetch posts: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(`Error fetching posts: ${err.message}`);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (!res.ok) {
        let errorMessage = `Failed to add post: ${res.status} ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMessage += ` - ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          const errorText = await res.text();
          errorMessage += ` - ${errorText.substring(0, 200)}...`;
        }
        throw new Error(errorMessage);
      }

      setTitle("");
      setContent("");
      await fetchPosts();
    } catch (err) {
      setError(`Error adding post: ${err.message}`);
      console.error("Add error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error(
          `Failed to delete post: ${res.status} ${res.statusText}`
        );
      }

      await fetchPosts();
    } catch (err) {
      setError(`Error deleting post: ${err.message}`);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setError("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Updating post:", id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });

      const res = await fetch(`${API_URL}${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      });

      console.log("Update response:", res.status, res.statusText);

      if (!res.ok) {
        let errorMessage = `Failed to update post: ${res.status} ${res.statusText}`;
        try {
          const errorData = await res.json();
          console.error("Update error data:", errorData);
          errorMessage += ` - ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          const errorText = await res.text();
          console.error("Non-JSON error response:", errorText);
          errorMessage += ` - ${errorText.substring(0, 200)}...`;
        }
        throw new Error(errorMessage);
      }

      const updatedPost = await res.json();
      console.log("Updated post:", updatedPost);

      setEditingId(null);
      await fetchPosts();
    } catch (err) {
      setError(`Error updating post: ${err.message}`);
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError("");
  };

  return (
    <div className="posts-container">
      <header className="posts-header">
        <h1 className="posts-title">Posts</h1>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && (
        <div className="alert alert-loading">
          <span className="loading-spinner"></span>
          Loading...
        </div>
      )}

      <section className="form-section">
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Enter post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="form-input"
            placeholder="Enter post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={loading}
          >
            Add Post
          </button>
        </div>
      </section>

      <ul className="posts-list">
        {posts.map((p) => (
          <li key={p.id} className="post-card">
            {editingId === p.id ? (
              <div className="edit-form">
                <div className="edit-inputs">
                  <input
                    className="edit-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Edit title..."
                  />
                  <input
                    className="edit-input"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit content..."
                  />
                </div>
                <div className="edit-actions">
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => saveEdit(p.id)}
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="post-content">
                  <h3 className="post-title">{p.title}</h3>
                  <p className="post-text">{p.content}</p>
                </div>
                <div className="post-actions">
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => startEdit(p)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(p.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
