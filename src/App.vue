<template>
  <div class="app">
    <div class="comments">
      <ul class="comment-list">
        <li v-for="comment in comments" :key="comment.id">
          <Comment :comment="comment" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Comment from './components/Comment.vue';

export default {
  name: 'App',
  components: {
    Comment,
  },
  setup() {
    const comments = [
      {
        id: 1,
        content:
          "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        createdAt: '1 month ago',
        score: 12,
        user: {
          image: {
            png: 'image-amyrobson.png',
            webp: 'image-amyrobson.webp',
          },
          username: 'amyrobson',
        },
        replies: [],
      },
      {
        id: 2,
        content:
          "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
        createdAt: '2 weeks ago',
        score: 5,
        user: {
          image: {
            png: 'image-maxblagun.png',
            webp: 'image-maxblagun.webp',
          },
          username: 'maxblagun',
        },
        replies: [
          {
            id: 3,
            content:
              "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
            createdAt: '1 week ago',
            score: 4,
            replyingTo: 'maxblagun',
            user: {
              image: {
                png: 'image-ramsesmiron.png',
                webp: 'image-ramsesmiron.webp',
              },
              username: 'ramsesmiron',
            },
          },
          {
            id: 4,
            content:
              "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
            createdAt: '2 days ago',
            score: 2,
            replyingTo: 'ramsesmiron',
            user: {
              image: {
                png: 'image-juliusomo.png',
                webp: 'image-juliusomo.webp',
              },
              username: 'juliusomo',
            },
          },
        ],
      },
      {
        id: 5,
        content: 'Test comment',
        createdAt: '1 day ago',
        score: 2,
        user: {
          image: {
            png: 'image-amyrobson.png',
            webp: 'image-amyrobson.webp',
          },
          username: 'amyrobson',
        },
        replies: [
          {
            id: 6,
            content: 'Hello',
            createdAt: '1 day ago',
            score: 0,
            replyingTo: 'amyrobson',
            user: {
              image: {
                png: 'image-juliusomo.png',
                webp: 'image-juliusomo.webp',
              },
              username: 'juliusomo',
            },
          },
        ],
      },
    ];

    return { comments };
  },
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Rubik', sans-serif;
  background-color: #f5f6fa;
  color: #67727e;
}

.app {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 64px 32px;
}

.btn {
  font-size: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.comments {
  width: 55%;
  margin: 0 auto;
}

.comment-list {
  list-style: none;
}
</style>
