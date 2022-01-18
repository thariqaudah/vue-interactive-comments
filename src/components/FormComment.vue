<template>
  <form class="form-comment">
    <textarea
      placeholder="Add a comment..."
      v-model="commentMessage"
    ></textarea>
    <button
      class="btn btn-primary"
      type="submit"
      v-if="comment"
      @click.prevent="updateComment"
    >
      Update
    </button>
    <button
      class="btn btn-primary"
      type="submit"
      v-if="replyingTo"
      @click.prevent="sendReply"
    >
      Reply
    </button>
    <button
      class="btn btn-primary"
      type="submit"
      v-if="!replyingTo && !comment"
      @click.prevent="sendComment"
    >
      Send
    </button>
  </form>
</template>

<script>
import { inject, onMounted, ref } from 'vue';
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/index';

export default {
  name: 'FormComment',
  props: ['replyingTo', 'parentCommentId', 'comment'],
  setup(props, { emit }) {
    const commentMessage = ref(null);
    const error = ref(null);
    const errMessage = ref(null);

    const currentUser = inject('currentUser');
    const addComment = inject('addComment');
    const addReply = inject('addReply');
    const editComment = inject('editComment');

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

      try {
        const commentSnap = await addDoc(
          collection(db, 'comments'),
          newComment
        );
        if (commentSnap.id) {
          commentMessage.value = null;
          addComment(commentSnap.id);
        } else {
          throw new Error('Failed add new comment');
        }
      } catch (err) {
        console.log(err);
        error.value = true;
        errMessage.value = err;
      }
    };

    const sendReply = async () => {
      error.value = false;
      errMessage.value = null;

      if (!commentMessage.value) {
        error.value = true;
        errMessage.value = 'Please add a comment';
        return;
      }

      // Remove replyingTo string in comment message
      const usernameLength = props.replyingTo.length;
      const startIndex = usernameLength + 3; // 3 for accounting @, coma, and space
      commentMessage.value = commentMessage.value.slice(startIndex);

      const newReply = {
        content: commentMessage.value,
        createdAt: Timestamp.now(),
        score: 0,
        replyingTo: props.replyingTo,
        user: {
          image: {
            png: currentUser.value.image.png,
            webp: currentUser.value.image.webp,
          },
          username: currentUser.value.username,
        },
      };

      try {
        const replyRef = collection(
          db,
          'comments',
          props.parentCommentId,
          'replies'
        );
        const replySnap = await addDoc(replyRef, newReply);
        console.log(replySnap);
        if (replySnap.id) {
          emit('closeForm');
          commentMessage.value = null;
          addReply(props.parentCommentId, {
            id: replySnap.id,
            ...newReply,
          });
        }
      } catch (err) {
        console.log(err);
        error.value = err;
      }
    };

    const updateComment = async () => {
      let commentRef;

      // Check if comment is a reply or not and remove a replyingTo string
      if (props.comment.replyingTo) {
        // Remove replyingTo string in comment message
        const usernameLength = props.comment.replyingTo.length;
        const startIndex = usernameLength + 3; // 3 for accounting @, coma, and space
        commentMessage.value = commentMessage.value.slice(startIndex);

        commentRef = doc(
          db,
          'comments',
          props.parentCommentId,
          'replies',
          props.comment.id
        );
      } else {
        commentRef = doc(db, 'comments', props.comment.id);
      }

      await updateDoc(commentRef, {
        content: commentMessage.value,
      });
      emit('closeEditForm');

      // Call function on App component
      editComment(
        props.parentCommentId,
        props.comment.id,
        commentMessage.value
      );
    };

    onMounted(() => {
      if (props.replyingTo) {
        commentMessage.value = `@${props.replyingTo}, `;
        return;
      }

      if (props.comment) {
        if (props.comment.replyingTo) {
          commentMessage.value = `@${props.comment.replyingTo}, ${props.comment.content}`;
          return;
        }

        commentMessage.value = props.comment.content;
        return;
      }
    });

    return {
      commentMessage,
      currentUser,
      sendComment,
      sendReply,
      updateComment,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-comment {
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
</style>
