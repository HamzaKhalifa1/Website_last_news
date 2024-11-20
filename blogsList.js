document.addEventListener('click', function (event) {
    if (event.target.classList.contains('icon')) {
        const blogContainer = event.target.closest('.container');
        const blogId = blogContainer.id;

        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to undo this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                blogContainer.remove();
                deleteBlogFromServer(blogId);
            }
        });
    }
});

function deleteBlogFromServer(blogId) {
    fetch(`http://localhost:8000/blogs/${blogId}`, {
        method: 'DELETE',
    })
        .then(() => {
            Swal.fire({
                title: 'Deleted!',
                text: `The blog with ID ${blogId} has been successfully deleted.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        })
        .catch((error) => {
            console.error('Error during deletion:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while deleting. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
}
fetchBlogs();

document.getElementById('new-blog-section').addEventListener('click', function (event) {
    if (event.target.id === 'create-new-blog') {
        Swal.fire({
            title: 'Create New Blog',
            html: `
                <form id="new-blog-form">
                    <label for="title">Title:</label>
                    <input type="text" id="title" name="title" required class="swal2-input" placeholder="Enter title" />

                    <label for="description">Description:</label>
                    <textarea id="description" name="description" required class="swal2-textarea" placeholder="Enter description"></textarea>

                    <label for="image-url">Image URL:</label>
                    <input type="text" id="image-url" name="image-url" class="swal2-input" placeholder="Enter image URL" required />
                </form>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const form = document.getElementById('new-blog-form');
                const title = form.title.value.trim();
                const description = form.description.value.trim();
                const imageUrl = form['image-url'].value.trim();

                // Validate inputs
                const titleRegex = /^[A-Z][a-zA-Z ]{1,49}$/;
                const descriptionRegex = /^[a-zA-Z ]{1,1000}$/;

                if (!titleRegex.test(title)) {
                    Swal.showValidationMessage('Title must start with a capital letter and be less than 50 characters.');
                    return false;
                }
                if (!descriptionRegex.test(description)) {
                    Swal.showValidationMessage('Description must contain only English characters and be less than 1000 characters.');
                    return false;
                }
                if (!imageUrl) {
                    Swal.showValidationMessage('Image URL is required!');
                    return false;
                }

                return { title, description, imageUrl };
            }

        }).then((result) => {
            if (result.isConfirmed) {
                const { title, description, imageUrl } = result.value;

                // Send the data to the JSON server
                fetch('http://localhost:8000/blogs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, description, imageUrl })
                })
                    .then((response) => response.json())
                    .then(() => {
                        Swal.fire('Blog Created!', 'Your new blog has been created.', 'success');
                        fetchBlogs();
                    })
                    .catch((error) => {
                        console.error('Error adding blog:', error);
                        Swal.fire('Error!', 'There was an issue creating the blog. Please try again.', 'error');
                    });
            }
        });
    }
});


function fetchBlogs() {
    fetch('http://localhost:8000/blogs')
        .then((response) => response.json())
        .then((data) => {
            const blogsContainer = document.getElementById('over_all');
            blogsContainer.innerHTML = '';

            data.forEach((blog) => {
                const blogElement = document.createElement('div');
                blogElement.classList.add('container');
                blogElement.id = blog.id;
                blogElement.innerHTML = `
                    <div>
                        <img class="img" src="${blog.imageUrl}" alt="Blog Image">
                        <i class="fa fa-trash icon"></i>
                    </div>
                    <h2 class="Large_text">${blog.title}</h2>
                    <p class="small_text">${blog.description}</p>
                `;
                blogsContainer.appendChild(blogElement);
            });
        })
        .catch((error) => {
            console.error('Error fetching blogs:', error);
        });
}
