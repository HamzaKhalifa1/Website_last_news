fetchBlogs();
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
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                blogContainer.remove();
                deleteBlogFromServer(blogId);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Action was canceled.",
                    timer: 1500,
                    showConfirmButton: false,
                });
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
                text: 'The blog has been successfully deleted.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            fetchBlogs();
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

document.addEventListener('click', function (event) {
    if (event.target.id === 'create-new-blog') {
        Swal.fire({
            title: 'Create New Blog',
            html: `
                <form id="new-blog-form">
                    <label for="title">Title:</label>
                    <input type="text" id="title" name="title" required class="swal2-input" placeholder="Enter title" />
                    <div id="title-error" class="error-message"></div>

                    <label for="description">Description:</label>
                    <textarea id="description" name="description" required class="swal2-textarea" placeholder="Enter description"></textarea>
                    <div id="description-error" class="error-message"></div>

                    <label for="image-url">Image URL:</label>
                    <input type="text" id="image-url" name="image-url" required class="swal2-input" placeholder="Enter image URL" />
                    <div id="image-url-error" class="error-message"></div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            didOpen: () => {
                const form = document.getElementById('new-blog-form');
                const titleField = form.title;
                const descriptionField = form.description;
                const imageUrlField = form['image-url'];
                const titleError = document.getElementById('title-error');
                const descriptionError = document.getElementById('description-error');
                const imageUrlError = document.getElementById('image-url-error');

                const validateTitle = () => {
                    const titleValue = titleField.value.trim();
                    const errors = [];

                    if (!/^[A-Z]/.test(titleValue)) {
                        errors.push('Title must start with a capital letter');
                    }

                    if (titleValue.length > 50) {
                        errors.push('be less than 50 characters');
                    }

                    if (errors.length > 0) {
                        titleError.textContent = errors.join(' and ') + '.';
                        titleField.classList.add('input-error');
                    } else {
                        titleError.textContent = '';
                        titleField.classList.remove('input-error');
                    }
                };

                const validateDescription = () => {
                    const descriptionValue = descriptionField.value.trim();
                    const errors = [];

                    if (!/^[a-zA-Z ]*$/.test(descriptionValue)) {
                        errors.push('Description must contain only English characters and spaces');
                    }

                    if (descriptionValue.length > 1000) {
                        errors.push('be less than 1000 characters');
                    }

                    if (errors.length > 0) {
                        descriptionError.textContent = errors.join(' and ') + '.';
                        descriptionField.classList.add('input-error');
                    } else {
                        descriptionError.textContent = '';
                        descriptionField.classList.remove('input-error');
                    }
                };

                const validateImageUrl = () => {
                    const imageUrlValue = imageUrlField.value.trim();
                    const errors = [];

                    if (!imageUrlValue) {
                        errors.push('Image URL is required');
                    }

                    const urlRegex = /^(https?:\/\/[^\s]+)$/;
                    if (imageUrlValue && !urlRegex.test(imageUrlValue)) {
                        errors.push('Invalid URL format');
                    }

                    if (errors.length > 0) {
                        imageUrlError.textContent = errors.join(' and ') + '.';
                        imageUrlField.classList.add('input-error');
                    } else {
                        imageUrlError.textContent = '';
                        imageUrlField.classList.remove('input-error');
                    }
                };

                const updateSubmitButtonState = () => {
                    const submitButton = Swal.getConfirmButton();
                    const isTitleValid = /^[A-Z]/.test(titleField.value.trim()) && titleField.value.trim().length <= 50;
                    const isDescriptionValid = /^[a-zA-Z ]*$/.test(descriptionField.value.trim()) && descriptionField.value.trim().length <= 1000;
                    const isImageUrlValid = /^(https?:\/\/[^\s]+)$/.test(imageUrlField.value.trim());

                    if (isTitleValid && isDescriptionValid && isImageUrlValid) {
                        submitButton.style.opacity = '1';
                        submitButton.disabled = false;
                    } else {
                        submitButton.style.opacity = '0.5';
                        submitButton.disabled = true;
                    }
                };

                titleField.addEventListener('input', () => {
                    validateTitle();
                    updateSubmitButtonState();
                });

                descriptionField.addEventListener('input', () => {
                    validateDescription();
                    updateSubmitButtonState();
                });

                imageUrlField.addEventListener('input', () => {
                    validateImageUrl();
                    updateSubmitButtonState();
                });

                updateSubmitButtonState();
            },

            preConfirm: () => {
                const form = document.getElementById('new-blog-form');
                const title = form.title.value.trim();
                const description = form.description.value.trim();
                const imageUrl = form['image-url'].value.trim();

                if (!/^[A-Z]/.test(title) || title.length > 50 ||
                    !/^[a-zA-Z ]*$/.test(description) || description.length > 1000 ||
                    !/^(https?:\/\/[^\s]+)$/.test(imageUrl)) {
                    return false;
                }

                return { title, description, imageUrl };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { title, description, imageUrl } = result.value;

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
