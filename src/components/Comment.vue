<template>
  <div>
    <div class="comment">
      <div class="comment-vote">
        <form>
          <button class="btn btn-upvote" type="button" @click="upVote">
            <i class="fas fa-plus icon-vote"></i>
          </button>
          <input type="number" v-model="vote" />
          <button class="btn btn-downvote" type="button" @click="downVote">
            <i class="fas fa-minus icon-vote"></i>
          </button>
        </form>
      </div>
      <div class="comment-main">
        <div class="comment-header">
          <div class="user-profile">
            <img
              class="avatar"
              :src="require(`../assets/avatars/${comment.user.image.png}`)"
              alt="user image"
            />
            <p class="username">{{ comment.user.username }}</p>
          </div>
          <p class="created-at">{{ comment.createdAt }}</p>
          <button class="btn btn-reply">
            <i class="fas fa-reply"></i>
            <span>Reply</span>
          </button>
        </div>
        <div class="comment-body">
          <p>
            <span class="replying-to" v-if="comment.replyingTo"
              >@{{ comment.replyingTo }}</span
            >
            {{ comment.content }}
          </p>
        </div>
      </div>
    </div>

    <div class="replies" v-if="comment.replies">
      <ul class="comment-list">
        <li v-for="comment in comment.replies" :key="comment.id">
          <Comment :comment="comment" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Comment from './Comment.vue';

export default {
  name: 'Comment',
  components: { Comment },
  props: ['comment'],
  setup(props) {
    const vote = ref(props.comment.score);

    const upVote = () => {
      vote.value++;
    };

    const downVote = () => {
      vote.value--;
    };

    return { vote, upVote, downVote };
  },
};
</script>

<style lang="scss" scoped>
.comment {
  background-color: #fff;
  display: flex;
  gap: 32px;
  border-radius: 9px;
  padding: 24px;
  margin-bottom: 24px;

  .comment-vote {
    form {
      background-color: #eaecf1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      width: 48px;
      padding: 8px;
      border-radius: 9px;
    }

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type='number'] {
      -moz-appearance: textfield;
    }

    input[type='number'] {
      display: inline-block;
      background-color: #eaecf1;
      width: 100%;
      border: none;
      outline: none;
      padding: 0;
      margin: 0;
      text-align: center;
      font-size: 18px;
      font-family: inherit;
      font-weight: 500;
      color: #5457b6;
      pointer-events: none;
    }

    .icon-vote {
      font-size: 14px;
      color: #c3c4ef;
    }

    button.btn-upvote:hover .icon-vote {
      color: #5457b6;
    }

    button.btn-downvote:hover .icon-vote {
      color: #5457b6;
    }
  }

  .comment-main {
    width: 100%;
    .comment-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .user-profile {
        display: flex;
        align-items: center;
        gap: 16px;

        .avatar {
          width: 40px;
          height: 40px;
        }

        .username {
          font-weight: 500;
          color: #324152;
        }
      }

      .created-at {
        margin-left: 16px;
        color: #67727e;
      }

      .btn-reply {
        margin-left: auto;
        color: #5457b6;

        span {
          font-weight: 700;
          margin-left: 8px;
        }
      }

      .btn-reply:hover {
        color: #c3c4ef;
      }
    }

    .comment-body {
      line-height: 1.6;

      .replying-to {
        font-weight: 500;
        color: #5457b6;
      }
    }
  }
}

.replies {
  margin-left: 32px;
  padding-left: 32px;
  border-left: 2px solid #eaecf1;
}
</style>
