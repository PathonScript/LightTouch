import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import Head from 'next/head'

import middleware from "../middlewares/middleware";

import Ring from "../components/Ring";
import RoomForm from "../components/RoomForm";
import Layout from '../components/Layout';

import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function Home() {
	const [light, setLight] = useState(false);

	const mouseEnter = async () => {
		socket.emit("public light", true);
		setLight(true);

		return;
	};

	const mouseLeave = async () => {
		socket.emit("public light", false);
		setLight(false);

		return;
	};

	useEffect((): any => {
		socket = io();

		socket.on("public light", (status) => {
			setLight(status[0]);
		});

		if (socket) return () => socket.disconnect();
	}, []);

	return (
		<Layout>
			<Head>
				<title>Light Touch</title>
				<link rel="icon" href="/assets/PixelLight.png" />
			</Head>
			<div className="flex flex-col w-full h-screen items-center justify-center bg-slate-800">
				<h1 className="text-5xl text-yellow-300">Light Touch</h1>
				<p className="text-xl text-yellow-300 my-2">Connects long-distance relationships with a lamp?</p>
				<Ring
					isHovering={light}
					onMouseEnter={mouseEnter}
					onMouseLeave={mouseLeave}
				/>
				<RoomForm />
			</div>
		</Layout>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	await middleware.run(req, res);

	return {
		props: {},
	};
};
