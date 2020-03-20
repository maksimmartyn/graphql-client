import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

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
        onCompleted: () => history.push('/')
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