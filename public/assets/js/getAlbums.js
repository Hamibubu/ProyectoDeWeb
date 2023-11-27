$(document).ready(function() {
    const url = window.location.href;
    const artistId = url.substring(url.lastIndexOf('/') + 1);
    console.log(artistId)
    $.ajax({
        type: "GET",
        url: `/api/albums/show/${artistId}`,
        success: function (response) {
            response.forEach(imagen => {
                const galleryItem = $('<div>').addClass('gallery-item').attr('tabindex', '0');
                const anchor = $('<a>').attr('id', `${imagen._id}`);
                const img = $('<img>')
                    .attr('src', `/uploads/${imagen.albumPhoto}`)
                    .addClass('gallery-image')
                    .attr('alt', '');
                anchor.append(img); 
                const galleryItemInfo = $('<div>').addClass('gallery-item-info');
                const ul = $('<ul>');
                const liLikes = $('<li>').addClass('gallery-item-likes');
                liLikes.html(`<span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> ${imagen.approval}`);
                ul.append(liLikes);
                const liComments = $('<li>').addClass('gallery-item-comments');
                liComments.html(`<span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> ${imagen.name}`);
                ul.append(liComments);
                galleryItemInfo.append(ul);
                anchor.append(galleryItemInfo);
                galleryItem.append(anchor);
                $('#albums').append(galleryItem);
                $('#albums').on('click', `#${imagen._id}`, function(event) {
                    event.preventDefault();
                    window.location.href = `/api/albums/show/spec/${encodeURIComponent(artistId)}?albumId=${encodeURIComponent(imagen._id)}`
                });
            });
        }
    });
});