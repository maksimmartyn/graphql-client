import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Link, { LinkType } from './Link';

export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const LinksList = () => {
    const { loading, error, data } = useQuery(FEED_QUERY);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error :(</div>;

    const { links } = data.feed;

    return (
        <div>
            {links.map((link: LinkType, index: number) => 
                <Link 
                  key={link.url} 
                  link={link} 
                  index={index} 
                />
            )}
        </div>
    );
};

export default LinksList;