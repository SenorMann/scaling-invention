import { GetStaticProps } from "next";
import React from "react";
import { Page } from "../../components";

type Props = {
  post: {
    id: number;
    userId: number;
    title: string;
    body: string;
  }
}

export default function Post({ post }: Props) {
  return (
    <Page title={`Post: ${post.id}`}>
      <section style={{ textAlign: "center" }}>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </section>
    </Page>
  )
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${params?.id}`);
  const post = await response.json();

  return {
    props: { post },
  }
}
export async function getStaticPaths ()  {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();

  const paths = users.map((user) => ({
    params: { id: user.id.toString() }
  }));

  return {
    paths,
    fallback: "blocking"
  }
}

