import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

type User = {
  id: string;
  name: string;
  email: string;
  links: LinkType[];
};

export type Vote = {
  id: string;
  user: User;
  link: LinkType;
};

export type LinkType = {
  id: string;
  url: string;
  description: string;
  votes: Vote[];
  postedBy: User;
  createdAt: string;
};

type LinkProps = {
  link: LinkType;
  index: number;
};

const Link = ({ link, index }: LinkProps) => {
  const { id, url, description, votes, postedBy, createdAt } = link;
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const [vote] = useMutation(VOTE_MUTATION);
  const upVote = () =>
    vote({
      variables: { linkId: id },
    });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>

        {authToken && (
          <div className="ml1 gray f11" onClick={upVote}>
            ▲
          </div>
        )}
      </div>

      <div className="ml1">
        <div>
          {description} ({url})
        </div>

        <div className="f6 lh-copy gray">
          {votes.length} votes | by {postedBy ? postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
