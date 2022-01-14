<template>
  <form class="form">
			<textarea
				placeholder="Add a comment..."
				v-model="commentMessage"
			></textarea>
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
				v-else
				@click.prevent="sendComment"
			>
				Send
			</button>
		</form>
</template>

<script>
import { inject, onMounted, ref } from 'vue';
import { addDoc, getDoc, collection, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/index';

export default {
	name: 'FormComment',
	props: ['replyingTo', 'parentComment'],
	setup(props) {
		const commentMessage = ref(null);
		const error = ref(null);
		const errMessage = ref(null);

		const currentUser = inject('currentUser');
		const addComment = inject('addComment');
		const addReply = inject('addReply');

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
				// const replyRef = await addDoc(collection(db, ));
				const commentSnap = await getDoc(
					doc(db, 'comments', props.parentComment)
				);
				const replySnap = await addDoc(
					collection(db, 'comments', commentSnap.id, 'replies'),
					newReply
				);
				if (replySnap.id) {
					commentMessage.value = null;
					addReply(commentSnap.id, replySnap.id);
				}
			} catch (err) {
				console.log(err);
				error.value = err;
			}
		};

		onMounted(() => {
			if (props.replyingTo) {
				commentMessage.value = `@${props.replyingTo}, `;
			}
		});

		return { commentMessage, currentUser, sendComment, sendReply };
	},
};
</script>

<style lang="scss" scoped>