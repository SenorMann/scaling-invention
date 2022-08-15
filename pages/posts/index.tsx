import { GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import { Page } from "../../components";

type Props = {
  posts: Array<{
    id: number;
    userId: number;
    title: string;
    body: string;
  }>
}

export default function Posts({ posts }: Props) {
  return (
    <Page title="Posts">
      <ol>
        {posts.map(({ id, title }) => (
          <li key={id}>
            <Link href={`posts/${id}`}>{title}</Link>
          </li>
        ))}
      </ol>
    </Page>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();

  return { props: { posts } }
}