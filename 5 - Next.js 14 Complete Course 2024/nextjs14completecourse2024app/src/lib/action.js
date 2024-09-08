'use server';

import { revalidatePath } from 'next/cache';
import { Post, User } from './models';
import { connectToDb } from './utils';
import { signIn, signOut } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { isRedirectError } from 'next/dist/client/components/redirect';

export const addPost = async (prevState, formData) => {
	// const title = formData.get('title');
	// const desc = formData.get('desc');
	// const slug = formData.get('slug');

	// console.log(title, desc, slug);

	const { title, desc, slug, userId } = Object.fromEntries(formData);

	try {
		connectToDb();
		const newPost = new Post({
			title,
			desc,
			slug,
			userId,
		});

		await newPost.save();
		console.log('saved to DB!');
		revalidatePath('/blog');
		revalidatePath('/admin');
	} catch (err) {
		console.log(err);
		return { error: 'Something went wrong!' };
	}
};

export const deletePost = async (formData) => {
	const { id } = Object.fromEntries(formData);

	try {
		connectToDb();

		await Post.findByIdAndDelete(id);
		console.log('deleted from DB!');
		revalidatePath('/blog');
		revalidatePath('/admin');
	} catch (err) {
		console.log(err);
		return { error: 'Something went wrong!' };
	}
};

export const addUser = async (prevState, formData) => {
	const { username, email, password, img } = Object.fromEntries(formData);

	try {
		connectToDb();
		const newUser = new User({
			username,
			email,
			password,
			img,
		});

		await newUser.save();
		console.log('saved to DB!');
		revalidatePath('/admin');
	} catch (err) {
		console.log(err);
		return { error: 'Something went wrong!' };
	}
};

export const deleteUser = async (formData) => {
	const { id } = Object.fromEntries(formData);

	try {
		connectToDb();

		await Post.deleteMany({ userId: id });
		await User.findByIdAndDelete(id);
		console.log('deleted from DB!');
		revalidatePath('/admin');
	} catch (err) {
		console.log(err);
		return { error: 'Something went wrong!' };
	}
};

export const handleGithubLogin = async () => {
	await signIn('github');
};

export const handleLogout = async () => {
	await signOut();
};

export const register = async (previousState, formData) => {
	const { username, email, password, passwordRepeat } = Object.fromEntries(formData);

	if (password !== passwordRepeat) {
		return { error: 'Password do not match!' };
	}

	try {
		connectToDb();

		const user = await User.findOne({ username });

		if (user) {
			return { error: 'Username already exists!' };
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		await newUser.save();
		console.log('saved to db');

		return { success: true };
	} catch (err) {
		console.log(err);
		return { error: 'Something went wrong!' };
	}
};

export const login = async (prevState, formData) => {
	const { username, password } = Object.fromEntries(formData);

	try {
		await signIn('credentials', { username, password });
	} catch (err) {
		console.log(err.message);
		if (err.message.includes('CredentialsSignin')) {
			return { error: 'Invalid Username or Password!' };
		}
		throw err;

		// if (isRedirectError(err)) {
		// 	throw err;
		// } else {
		// 	console.log(err);
		// 	return { error: 'Something went wrong!' };
		// }
	}
};
