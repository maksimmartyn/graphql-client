import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Link, {LinkType} from './Link';

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
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
`

function Search() {
    const [filter, setFilter] = useState('');
    const { data, refetch } = useQuery(FEED_SEARCH_QUERY, {
        variables: {filter},
    }); 

    return (
        <div>
            <div>
                Search
                
                <input
                    type='text'
                    onChange={e => setFilter(e.target.value)}
                />

                <button onClick={() => refetch({filter})}>OK</button>
            </div>

            {data?.feed?.links.map((link: LinkType, index: number) => (
                <Link key={link.id} link={link} index={index} />
            ))}
      </div>
    );
}

export default Search;