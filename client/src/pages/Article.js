import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArticleContent from "./article-content";
// form component
import Articles from "../components/Articles";
import NotFound from "./NotFound";
import CommentList from "../components/CommentList";
import AddCommentForm from "../components/AddCommentForm";

const Article = () => {
  const { name } = useParams();
  const article = ArticleContent.find((article) => article.name === name);
  const [articleInfo, setArticleInfo] = useState({ comments: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/articles/${name}`);
      const body = await result.json();
      console.log(body);
      setArticleInfo(body);
    };
    fetchData();
  }, [name]);

  if (!article) {
    return (
      <h1>
        {" "}
        <NotFound />{" "}
      </h1>
    );
  }

  const otherArticles = ArticleContent.filter(
    (article) => article.name !== name
  );
  return (
    <>
      <h1 className="sm:text-4xl text-2xl font-bold my-6 text-gray-900">
        {article.title}
      </h1>
      {article.content.map((paragraph, index) => (
        <p className="mx-auto leading-relaxed text-base mb-4" key={index}>
          {paragraph}
        </p>
      ))}

      <CommentList comments={articleInfo.comments} />
      <AddCommentForm articleName={name} setArticleInfo={setArticleInfo} />
      <h1 className="sm:text-2xl text-xl font-bold my-5 text-gray-900">
        Other Articles to Read
      </h1>
      <div className="flex flex-wrap -m-4">
        <Articles articles={otherArticles} />
      </div>
    </>
  );
};

export default Article;
