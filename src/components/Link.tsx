import React from 'react';

export type LinkType = {
    id: string
    url: string
    description: string 
}

type LinkProps = {
    link: LinkType
}

const Link = ({link} : LinkProps) => {
    const {url, description} = link;

    return (
        <div>
            <div>{description} ({url})</div>
        </div>
    );
};

export default Link;