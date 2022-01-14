<template>
  <div class="form-comment">
    <div class="user-profile">
      <img
        class="avatar"
        :src="require(`../assets/avatars/${currentUser.image.png}`)"
        alt="Current user photo"
      />
    </div>

    <form class="form" @submit.prevent="sendComment">
      <textarea
        placeholder="Add a comment..."
        v-model="commentMessage"
      ></textarea>
      <button class="btn btn-primary" type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import { inject, onMounted, ref } from 'vue';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/index';

export default {
  name: 'FormComment',
  props: ['replyingTo'],
  setup(props) {
    const commentMessage = ref(null);
    const error = ref(null);
    const errMessage = ref(null);

    const currentUser = inject('currentUser');
    const addComment = inject('addComment');

    const sendComment = async () => {
      error.value = false;
      errMessage.value = null;

      if (!commentMessage.value) {
        error.value = true;
        errMessage.value = 'Please add a comment';
        return;
      }

      const newComment = {
        content: commentMessage.value,
        createdAt: Timestamp.now(),
        score: 0,
        user: {
          image: {
            png: currentUser.value.image.png,
            webp: currentUser.value.image.webp,
          },
          username: currentUser.value.username,
        },
      };

      if (props.replyingTo) {
        console.log(`this is a reply to ${props.replyingTo}`);

        // Add replyingTo prop to comment object
        newComment.replyingTo = props.replyingTo;

        // Remove replyingTo string in comment message
        const usernameLength = props.replyingTo.length;
        const startIndex = usernameLength + 3;
        newComment.content = commentMessage.value.slice(startIndex);

        props.handleReply(newComment);

        return;
      }

      // Post new comment
      try {
        const docRef = await addDoc(collection(db, 'comments'), newComment);
        if (docRef.id) {
          commentMessage.value = null;
          addComment(docRef.id);
        } else {
          throw new Error('Failed add new comment');
        }
      } catch (err) {
        console.log(err);
        error.value = true;
        errMessage.value = err;
      }
    };

    onMounted(() => {
      if (props.replyingTo) {
        commentMessage.value = `@${props.replyingTo}, `;
      }
    });

    return { commentMessage, currentUser, sendComment };
  },
};
</script>

<style lang="scss" scoped>
.form-comment {
  background-color: #fff;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  border-radius: 9px;
  padding: 24px;

  .user-profile {
    display: flex;
    justify-content: center;
    align-items: center;

    .avatar {
      width: 50px;
      height: 50px;
    }
  }

  .form {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 16px;

    textarea {
      flex: 1;
      background-color: none;
      border: 1px solid #eaecf1;
      font-size: 16px;
      font-family: inherit;
      color: #324152;
      padding: 12px 16px;
      min-height: 100px;
      border-radius: 9px;
      resize: none;

      &:focus {
        outline: none;
        border-color: #324152;
      }
    }
  }
}
</style>
