function createMessage(id, text, sender, timestamp, isMe) {
    return {
      id: id,
      text: text,
      sender: sender,
      timestamp: timestamp,
      isMe: isMe,
    };
  }
  
  function getRandomTime() {
    const date = new Date();
    date.setHours(date.getHours() - Math.random() * 24);
    return date;
  }
  
  export const mockConversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'See you tomorrow! 👋',
      lastMessageTime: '10:30 AM',
      unread: 2,
      online: true,
      messages: [
        createMessage('m1', 'Hey there!', 'Sarah Johnson', getRandomTime(), false),
        createMessage('m2', 'Hi Sarah! How are you?', 'me', getRandomTime(), true),
        createMessage('m3', 'I\'m good, thanks! Just finishing up some work.', 'Sarah Johnson', getRandomTime(), false),
        createMessage('m4', 'How about you?', 'Sarah Johnson', getRandomTime(), false),
        createMessage('m5', 'I\'m doing well. Just planning for the weekend.', 'me', getRandomTime(), true),
        createMessage('m6', 'Any exciting plans?', 'Sarah Johnson', getRandomTime(), false),
        createMessage('m7', 'Thinking of going hiking, weather permitting.', 'me', getRandomTime(), true),
        createMessage('m8', 'That sounds lovely! Where are you planning to go?', 'Sarah Johnson', getRandomTime(), false),
        createMessage('m9', 'Probably Cedar Ridge. The trails are really nice this time of year.', 'me', getRandomTime(), true),
        createMessage('m10', 'I\'ve been there once, beautiful views! Take lots of pictures.', 'Sarah Johnson', getRandomTime(), false),
        createMessage('m11', 'Will do! Want to join us next time?', 'me', getRandomTime(), true),
        createMessage('m12', 'Definitely! I\'d love that.', 'Sarah Johnson', getRandomTime(), false),
        createMessage('m13', 'Great, I\'ll let you know when we plan the next trip.', 'me', getRandomTime(), true),
        createMessage('m14', 'Perfect! Looking forward to it.', 'Sarah Johnson', getRandomTime(), false),
        createMessage('m15', 'See you tomorrow! 👋', 'Sarah Johnson', getRandomTime(), false)
      ]
    },
    {
      id: '2',
      name: 'James Miller',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Did you check the latest report?',
      lastMessageTime: 'Yesterday',
      unread: 0,
      online: false,
      messages: [
        createMessage('m1', 'Hey James, how\'s it going?', 'me', getRandomTime(), true),
        createMessage('m2', 'Pretty good, thanks. Just busy with the new project.', 'James Miller', getRandomTime(), false),
        createMessage('m3', 'How\'s your side of things coming along?', 'James Miller', getRandomTime(), false),
        createMessage('m4', 'Making progress, but still have some challenges with the data analysis.', 'me', getRandomTime(), true),
        createMessage('m5', 'I can help with that! I just finished a similar analysis.', 'James Miller', getRandomTime(), false),
        createMessage('m6', 'That would be fantastic! When are you free to discuss?', 'me', getRandomTime(), true),
        createMessage('m7', 'How about tomorrow afternoon? Around 2pm?', 'James Miller', getRandomTime(), false),
        createMessage('m8', 'Perfect, I\'ll block that on my calendar.', 'me', getRandomTime(), true),
        createMessage('m9', 'Great! I\'ll send you the report beforehand.', 'James Miller', getRandomTime(), false),
        createMessage('m10', 'Thanks, I appreciate it.', 'me', getRandomTime(), true),
        createMessage('m11', 'Did you check the latest report?', 'James Miller', getRandomTime(), false)
      ]
    },
    {
      id: '3',
      name: 'Emma Thompson',
      avatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'The meeting is rescheduled to 3PM',
      lastMessageTime: 'Monday',
      unread: 1,
      online: true,
      messages: [
        createMessage('m1', 'Hi Emma, just confirming our meeting today.', 'me', getRandomTime(), true),
        createMessage('m2', 'Hi! Actually, I need to reschedule.', 'Emma Thompson', getRandomTime(), false),
        createMessage('m3', 'No problem. When works better for you?', 'me', getRandomTime(), true),
        createMessage('m4', 'Would 3PM work for you instead?', 'Emma Thompson', getRandomTime(), false),
        createMessage('m5', 'Yes, that works for me.', 'me', getRandomTime(), true),
        createMessage('m6', 'Great! See you then. I\'ll update the calendar invite.', 'Emma Thompson', getRandomTime(), false),
        createMessage('m7', 'Perfect, thanks for letting me know.', 'me', getRandomTime(), true),
        createMessage('m8', 'The meeting is rescheduled to 3PM', 'Emma Thompson', getRandomTime(), false)
      ]
    },
    {
      id: '4',
      name: 'David Wilson',
      avatar: 'https://i.pravatar.cc/150?img=7',
      lastMessage: 'Thanks for the recommendation!',
      lastMessageTime: 'Monday',
      unread: 0,
      online: false,
      messages: [
        createMessage('m1', 'Hey David, have you tried that new restaurant downtown?', 'me', getRandomTime(), true),
        createMessage('m2', 'Not yet, but I\'ve heard good things! Is it worth checking out?', 'David Wilson', getRandomTime(), false),
        createMessage('m3', 'Definitely! The pasta is amazing.', 'me', getRandomTime(), true),
        createMessage('m4', 'I\'ll have to try it then. Any dish you particularly recommend?', 'David Wilson', getRandomTime(), false),
        createMessage('m5', 'The mushroom risotto is their specialty. Also, save room for dessert!', 'me', getRandomTime(), true),
        createMessage('m6', 'Sounds delicious! I\'ll check it out this weekend.', 'David Wilson', getRandomTime(), false),
        createMessage('m7', 'Let me know what you think!', 'me', getRandomTime(), true),
        createMessage('m8', 'Will do! Thanks for the recommendation!', 'David Wilson', getRandomTime(), false)
      ]
    },
    {
      id: '5',
      name: 'Olivia Parker',
      avatar: 'https://i.pravatar.cc/150?img=9',
      lastMessage: 'The design looks great!',
      lastMessageTime: 'Sunday',
      unread: 0,
      online: true,
      messages: [
        createMessage('m1', 'Hi Olivia, I sent over the new design mockups.', 'me', getRandomTime(), true),
        createMessage('m2', 'Got them! Looking through them now.', 'Olivia Parker', getRandomTime(), false),
        createMessage('m3', 'Great, let me know your thoughts when you get a chance.', 'me', getRandomTime(), true),
        createMessage('m4', 'First impression - I love the color palette you chose!', 'Olivia Parker', getRandomTime(), false),
        createMessage('m5', 'Thanks! I was inspired by your brand guidelines.', 'me', getRandomTime(), true),
        createMessage('m6', 'The layout is also very intuitive. Just a few small tweaks needed.', 'Olivia Parker', getRandomTime(), false),
        createMessage('m7', 'I\'ll send detailed feedback by end of day.', 'Olivia Parker', getRandomTime(), false),
        createMessage('m8', 'Perfect, I\'ll be on the lookout for it.', 'me', getRandomTime(), true),
        createMessage('m9', 'The design looks great!', 'Olivia Parker', getRandomTime(), false)
      ]
    }
  ];
  