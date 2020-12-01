let manager = new CanvasManager(); // todo all the network

let db = firebase.database();
let myRef = db.ref('users/' + manager.myId);

myRef.onDisconnect().remove(); // whenever this tab is closed, the db will erase myRef

// set the db with our canvas every 3 second
setInterval(() => {
myRef.set(manager.getMyData());
}, 3000);

//on load, get everyone's data once
db.ref('users').once('value', (snapshot) => {
	let update = snapshot.val();
	let updates = Object.values(users);
	for(let i = 0; i < updates.length; i++) {
		if (update.id !== manager.myId) {
		manager.updateRemoteDisplay(update);
	 }
	}
});

//whenever users tabler is changed, grab the data and update our remote displays
db.ref('users').on('child_changed', (snapshot) => {
	let update = snapshot.val();
	if (update.id !== manager.myId) {
		manager.updateRemoteDisplay(update);
	}
});

db.ref('users').on('child_removed', (snapshot) => {
	let update = snapshot.val();
	// dont need to check if self because why would you see yourself deleting yourself?
	manager.removeRemoteDisplay(update);
});