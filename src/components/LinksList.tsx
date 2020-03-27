import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import Link, { LinkType } from './Link';
import { LINKS_PER_PAGE } from '../constants';

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
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
      count
    }
  }
`

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


interface PageParams {
  page: string;
}

interface RoutingInfo {
  isNewPage: boolean
  page: number
}

function useRoutingInfo(): RoutingInfo {
  const location = useLocation();
  const isNewPage = location.pathname.includes('new');

  const params = useParams<PageParams>(); 
  const page = parseInt(params.page, 10);
  
  return {isNewPage, page};
}

function useQueryVariables() {
  const {isNewPage, page} = useRoutingInfo();

  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? 'createdAt_DESC' : null;
  
  return { first, skip, orderBy };
}

function usePagination() {
  const history = useHistory();
  const { page } = useRoutingInfo();

  function nextPage(data: any) {
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      history.push(`/new/${nextPage}`);
    }
  }
  
  function previousPage() {
    if (page > 1) {
      const previousPage = page - 1;
      history.push(`/new/${previousPage}`);
    }
  }

  return [previousPage, nextPage];
}

const LinksList = () => {
    const queryVariables = useQueryVariables();
    const { loading, error, data, subscribeToMore } = useQuery(FEED_QUERY, {variables: queryVariables});

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

    const {isNewPage, page} = useRoutingInfo();
    const [prev, next] = usePagination();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error :(</div>;

    const { links } = data.feed;

    return (
        <div>
            {links.map((link: LinkType, index: number) => 
                <Link 
                  key={link.url} 
                  link={link} 
                  index={index + page} 
                />
            )}

            {isNewPage && (
              <div className="flex ml4 mv3 gray">
                <div className="pointer mr2" onClick={prev}>
                  Previous
                </div>
                <div className="pointer" onClick={() => next(data)}>
                  Next
                </div>
              </div>
            )}
        </div>
    );
};

export default LinksList;