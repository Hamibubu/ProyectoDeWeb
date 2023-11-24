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
            const img = $('<img>')
                .attr('src', `/uploads/${imagen.albumPhoto}`)
                .addClass('gallery-image')
                .attr('alt', '');
            galleryItem.append(img);
            const galleryItemInfo = $('<div>').addClass('gallery-item-info');
            const ul = $('<ul>');
            const liLikes = $('<li>').addClass('gallery-item-likes');
            liLikes.html(`<span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> ${imagen.approval}`);
            ul.append(liLikes);
            const liComments = $('<li>').addClass('gallery-item-comments');
            liComments.html(`<span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> ${imagen.name}`);
            ul.append(liComments);
            galleryItemInfo.append(ul);
            galleryItem.append(galleryItemInfo);
            $('#albums').append(galleryItem);
            });
        }
        
    });
});