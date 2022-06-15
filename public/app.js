///// User Authentication /////

const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');


const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});



///// Firestore /////

const db = firebase.firestore();

const createNote = document.getElementById('createNote');
const notesList = document.getElementById('notesList');


let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        notesRef = db.collection('notes')

        createNote.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;


            // Get the data from the form once the user clicks the create note button
            
            notesRef.add({
                author: user.uid,
                createdAt: serverTimestamp(),
                title: document.getElementById('noteTitle').value,
                subject: document.getElementById('noteSubject').value,
                content: document.getElementById('noteContent').value,
                imageLink: document.getElementById('noteImageLink').value,
            });
        }

        // Query and list all the notes, with their author and date created information on the firebase server in realtime

        // Use Bulma to style the list of notes

        unsubscribe = notesRef.onSnapshot(snapshot => {
            notesList.innerHTML = '';
            snapshot.docs.forEach(doc => {
                const note = doc.data();
                notesList.innerHTML += `
                    <div class="columns">
                        <div class="column">
                            <h3>${note.title}</h3>
                            <p>${note.subject}</p>
                            <p>${note.content}</p>
                            <p>${note.imageLink}</p>
                        </div>
                    </div>
                `;
            });
        }
        );





    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }
});

