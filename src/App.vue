<template>
	<div class="app">
		<!-- Comments -->
		<div class="comments">
			<ul class="comment-list">
				<li v-for="comment in comments" :key="comment.id">
					<SingleComment :comment="comment" />
				</li>
			</ul>
		</div>

		<!-- Form Comment -->
		<div class="form-area">
			<FormComment />
		</div>
	</div>
</template>

<script>
import { onMounted, provide, ref } from 'vue';
import SingleComment from './components/SingleComment.vue';
import FormComment from './components/FormComment.vue';
import { db } from './firebase/index';
import { collection, getDocs } from 'firebase/firestore';

export default {
	name: 'App',
	components: {
		SingleComment,
		FormComment,
	},
	setup() {
		// const comments = ref([
		// 	{
		// 		id: 1,
		// 		content:
		// 			"Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
		// 		createdAt: '1 month ago',
		// 		score: 12,
		// 		user: {
		// 			image: {
		// 				png: 'image-amyrobson.png',
		// 				webp: 'image-amyrobson.webp',
		// 			},
		// 			username: 'amyrobson',
		// 		},
		// 		replies: [],
		// 	},
		// 	{
		// 		id: 2,
		// 		content:
		// 			"Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
		// 		createdAt: '2 weeks ago',
		// 		score: 5,
		// 		user: {
		// 			image: {
		// 				png: 'image-maxblagun.png',
		// 				webp: 'image-maxblagun.webp',
		// 			},
		// 			username: 'maxblagun',
		// 		},
		// 		replies: [
		// 			{
		// 				id: 3,
		// 				content:
		// 					"If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
		// 				createdAt: '1 week ago',
		// 				score: 4,
		// 				replyingTo: 'maxblagun',
		// 				user: {
		// 					image: {
		// 						png: 'image-ramsesmiron.png',
		// 						webp: 'image-ramsesmiron.webp',
		// 					},
		// 					username: 'ramsesmiron',
		// 				},
		// 			},
		// 			{
		// 				id: 4,
		// 				content:
		// 					"I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
		// 				createdAt: '2 days ago',
		// 				score: 2,
		// 				replyingTo: 'ramsesmiron',
		// 				user: {
		// 					image: {
		// 						png: 'image-juliusomo.png',
		// 						webp: 'image-juliusomo.webp',
		// 					},
		// 					username: 'juliusomo',
		// 				},
		// 			},
		// 		],
		// 	},
		// ]);
		const currentUser = ref({
			image: {
				png: 'image-juliusomo.png',
				webp: 'image-juliusomo.webp',
			},
			username: 'juliusomo',
		});
		const comments = ref(null);

		provide('comments', comments);
		provide('currentUser', currentUser);

		onMounted(async () => {
			const querySnapshot = await getDocs(collection(db, 'comments'));
			querySnapshot.forEach(doc => console.log(doc.data()));
		});

		return { currentUser, comments };
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
	display: inline-block;
	font-size: 16px;
	background: none;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;
}

.btn-primary {
	background-color: #5457b6;
	color: #fff;
	padding: 12px 24px;
	border-radius: 9px;
	text-transform: uppercase;
	font-weight: 700;

	&:hover {
		background-color: #c3c4ef;
	}
}

.comments,
.form-area {
	width: 55%;
	margin: 0 auto;
}

.comment-list {
	list-style: none;
}
</style>
