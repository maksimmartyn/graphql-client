import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { FEED_QUERY } from './LinksList';
import { LINKS_PER_PAGE } from '../constants';

const CREATE_LINK_MUTATION = gql`
  mutation CreateLinkMutation($description: String!, $url: String!) {
    createLink(description: $description, url: $url) {
      id
      url
      description
    }
  }
`

function CreateLink() {
    const history = useHistory();
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        onCompleted: () => history.push('/new/1'),
        update: (store, { data: { createLink: link } }) => {
            const first = LINKS_PER_PAGE;
            const skip = 0
            const orderBy = 'createdAt_DESC'

            const data: any = store.readQuery({
              query: FEED_QUERY,
              variables: { first, skip, orderBy }
            });

            data.feed.links.unshift(link);

            store.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip, orderBy }
            })
        }
    });

    const submit = () => createLink({variables: {
        description,
        url,
    }});

    return (
        <div>
            <div className="flex flex-column mt3">
            <input
                className="mb2"
                value={description}
                onChange={e => setDescription(e.target.value)}
                type="text"
                placeholder="A description for the link"
            />
            <input
                className="mb2"
                value={url}
                onChange={e => setUrl(e.target.value)}
                type="text"
                placeholder="The URL for the link"
            />
            </div>
            <button onClick={submit}>Submit</button>
        </div>
    );
}

export default CreateLink;