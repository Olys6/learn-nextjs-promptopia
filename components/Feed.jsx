'use client';

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({
	data,
	handleTagClick,
	filteredData,
}) => {
	return (
		<div className='mt-16 prompt_layout'>
			{filteredData(data)?.map(post => (
				<PromptCard
					key={post._id}
					post={post}
					handleTagClick={handleTagClick}
				/>
			))}
		</div>
	);
};

const Feed = () => {
	const [searchText, setSearchText] = useState('');
	const [posts, setPosts] = useState([]);

	const handleSearchChange = e => {
		setSearchText(e.target.value);
	};

	const filteredData = data => {
		const regexSearch = new RegExp(`\\b${searchText}`, 'i');

		return data.filter(
			post =>
				regexSearch.exec(`#${post.tag}`) ||
				regexSearch.exec(post.prompt) ||
				regexSearch.exec(post.creator.username) ||
				regexSearch.exec(post.creator.email)
		);
	};

	const handleTagClick = tag => {
		setSearchText(tag[0] === '#' ? tag.split('#')[1] : tag);
	};

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch('/api/prompt');
				const data = await response.json();

				setPosts(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchPosts();
	}, []);

	return (
		<section className='feed'>
			<form className='relative w-full flex-center'>
				<input
					type='text'
					placeholder='Search for a tag or a username'
					value={searchText}
					onChange={handleSearchChange}
					required
					className='search_input peer'
				/>
			</form>

			<PromptCardList
				data={posts}
				handleTagClick={handleTagClick}
				filteredData={filteredData}
			/>
		</section>
	);
};

export default Feed;
