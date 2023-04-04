const users = [];

export const addUser = ({id, name, room}) => {
	name = name.trim().toLowerCase();
	room = room.trim().toLowerCase();

	const existingUser = users.find((user) => {
		user.room === room && user.name === name
	});

	if(existingUser) {
		return{error: "Username is taken"};
	}
	const user = {id,name,room};
	
	if (users.length < 2) 
		users.push(user);
	
	return { user, size: users.length };
}

export const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);
	if(index !== -1) users.splice(index,1)[0];
}

export const getUser = (id) => users.find((user) => user.id === id);

export const getUsersInRoom = (room) => users.filter((user) => user.room === room);

