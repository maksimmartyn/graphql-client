import React, { useEffect } from 'react';
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

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }
`;

const LinksList = () => {
    const { loading, error, data, subscribeToMore } = useQuery(FEED_QUERY);

    useEffect(() => {
      subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData: subscription }) => {
          if (!subscription.data) {
            return prev
          };

          const newLink: LinkType = subscription.data.newLink;
          const links: LinkType[] = prev.feed.links;
          const exists = links.some((link) => link.id === newLink.id);
          
          if (exists) {
            return prev;
          }
    
          return Object.assign({}, prev, {
            feed: {
              links: [newLink, ...links],
              count: links.length + 1,
              __typename: prev.feed.__typename
            }
          })
        }
      });

      subscribeToMore({
        document: NEW_VOTES_SUBSCRIPTION
      });
    });

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