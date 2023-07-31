import { NextResponse } from 'next/server';
import { addTweet } from '../../../data-access/feed/tweets';

export async function POST(request: Request) {
  const response:
    | { tweetId: string; message?: string; secret: string }
    | { tweetUrl: string; message?: string; secret: string } = await request.json();

  if (response.secret !== process.env.ADD_TWEET_SECRET) {
    return NextResponse.json({ message: `Given secret not recognised` }, { status: 401 });
  }

  const tweetId = 'tweetId' in response ? response.tweetId : new URL(response.tweetUrl).pathname.split('/').at(-1);

  const { message } = response;

  const tweetData = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}`);

  if (tweetData.status !== 200 || !tweetId) {
    return NextResponse.json({ message: `Tweet ID invalid: ${tweetId}` }, { status: 404 });
  }

  // TODO: Store Tweet Data?
  // const data = await tweetData.json();

  try {
    const data = await addTweet({ id: tweetId, message });
    return NextResponse.json(data);
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: 'Failed to insert into database', error: e, errorString: e.toString() },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: 'Failed to insert into database', error: e }, { status: 500 });
  }
}
