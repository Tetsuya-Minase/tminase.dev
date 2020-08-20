import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import { TagListQuery } from '../../types/graphql-types';
import { fontColor } from '../styles/variable';

type TagLink = {
  name: string;
  articleCount: number;
  url: string;
};

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 30%;
  align-items: center;
`;
const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: bold;
`;
const TagList = styled.ul`
  font-size: 1.6rem;
`;
const TagListItem = styled.li`
  &:not(:last-child) {
    margin: 0 0 0.8rem 0;
  }
`;
const Link = styled.a`
  color: ${fontColor.black};
  text-decoration: none;
`;

const convertTagList = (group: TagListQuery['allMarkdownRemark']['group']) => {
  return group
    .map(field => {
      if (field.fieldValue == undefined || field.nodes.length == 0) {
        return;
      }
      return {
        name: field.fieldValue,
        articleCount: field.nodes.length,
        url: `/tags/${field.fieldValue}`,
      };
    })
    .filter((item): item is TagLink => item != undefined);
};

export const SubColumnComponent: React.FC = () => {
  const data: TagListQuery = useStaticQuery(graphql`
    query TagList {
      allMarkdownRemark {
        group(field: frontmatter___tag) {
          fieldValue
          nodes {
            frontmatter {
              path
              title
            }
          }
        }
      }
    }
  `);
  const tagLinkList: TagLink[] = convertTagList(data.allMarkdownRemark.group);
  if (tagLinkList.length === 0) {
    return null;
  }
  const tagList = tagLinkList.map(tagLink => (
    <TagListItem key={tagLink.name}>
      <Link
        href={tagLink.url}
      >{`${tagLink.name}(${tagLink.articleCount})`}</Link>
    </TagListItem>
  ));
  return (
    <Aside>
      <Title>タグ一覧</Title>
      {tagList.length ? <TagList>{tagList}</TagList> : null}
    </Aside>
  );
};
