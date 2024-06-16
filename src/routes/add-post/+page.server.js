import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { Buffer } from 'buffer';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const username = data.get('username');
    const content = data.get('content');
    const image = data.get('image');

    if (!username || !content || !image) {
      return fail(400, { message: 'All fields are required' });
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    try {
      await prisma.post.create({
        data: {
          username,
          content,
          image: buffer
        }
      });

      throw redirect(302, '/');
    } catch (error) {
      return fail(500, { message: error.message });
    }
  }
};