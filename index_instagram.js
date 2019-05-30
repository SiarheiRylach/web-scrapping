'use strict';
const request = require('request-promise');
const cheerio = require('cheerio');

(async () => {
    const USERNAME = 'tjdillashaw';
    const BASE_URL = `https://instagram.com/${USERNAME}`;

    const response = await request(BASE_URL);
    const $ = cheerio.load(response)

    const script = $('script[type="text/javascript"]').eq(3).html();
    const script_regex = /^window._sharedData = (.+);$/g.exec(script);

    //an interesting case of using destruction for:
    //Object.entry_data.ProfilePage[0].graphql.user
    const { entry_data: { ProfilePage: { [0]: { graphql: { user } } } } } = JSON.parse(script_regex[1]);
    const { entry_data: { ProfilePage: { [0]: { graphql: { user: { edge_owner_to_timeline_media: { edges } } } } } } } = JSON.parse(script_regex[1]);

    let posts = edges.map(edge => {
        let { node } = edge;
        return {
            id: node.id,
            shortcode: node.shortcode,
            timestamp: node.taken_at_timestamp,
            likes: node.edge_liked_by.count,
            comments: node.edge_media_to_comment.count,
            isVideo: node.is_video,
            video_views: node.video_view_count,
            caption: node.edge_media_to_caption.edges.length ? node.edge_media_to_caption.edges[0].node.text : null,
            image_url: node.display_url
        };
    });

    const instagram_data = {
        followers: user.edge_followed_by.count,
        following: user.edge_follow.count,
        uploads: user.edge_owner_to_timeline_media.count,
        full_name: user.full_name,
        picture_url: user.profile_pic_url_hd,
        posts
    }
})();