const tweetTemplatesWithNames = [
  "{FI}. {LN} of {TH}, you’ve been ghosting people. Integrity says that if you say you will get back to someone...get back to them, mane.",
  "Hey {FI}. {LN} from {TH}, why ignore messages? If you're going to promise a callback, follow through, mane.",
  "{FI}. {LN} at {TH}, missing in action? You said you’d reply but seem to have vanished, mane.",
  "What’s up with the silence, {FI}. {LN} of {TH}? You owe people some communication, mane.",
  "{FI}. {LN} of {TH}, communication is key, they say. Seems like you missed that memo, mane.",
  "It’s called professional courtesy, {FI}. {LN} of {TH}. Letting someone hang by a thread isn’t cool, mane.",
  "{FI}. {LN} {TH}, a simple reply goes a long way. Don’t be the person who ghosts, mane.",
  "Not cool, {FI}. {LN} at {TH}. People expect better than being ignored. Step it up, mane.",
  "{FI}. {LN} of {TH}, your silence is louder than words. Time to get back to people, mane.",
  "Is your @ button broken, {FI}. {LN} of {TH}? Because hitting reply shouldn’t be hard, mane.",
  "{FI}. {LN}, people at {TH} should know, ghosting isn’t a professional move. What’s the holdup, mane?",
  "A bit of advice, {FI}. {LN} from {TH} – don’t make promises you can’t keep. Reply back, mane.",
  "{FI}. {LN} at {TH}, remember, good professionals communicate. Let’s see some of that, mane.",
  "Hey {FI}. {LN} of {TH}, avoiding emails and calls isn’t a strategy. Engage with your contacts, mane.",
  "MIA much? {FI}. {LN} at {TH}, it’s time to stop the vanishing act and start replying, mane.",
  "Being unreachable, {FI}. {LN} of {TH}, isn’t a good look. Get back to your pending replies, mane.",
  "If you’re going to commit to a reply, {FI}. {LN} from {TH}, make sure you follow through, mane.",
  "Ghosting alert: {FI}. {LN} at {TH}, you're on the radar! Time to start communicating, mane.",
  "Professional tip, {FI}. {LN} of {TH}: ignoring messages burns bridges. Time to rebuild, mane.",
  "Yo {FI}. {LN}, where’s that reply you promised? Folks at {TH} would like to know, mane.",
  "Heads up, {FI}. {LN} of {TH} – going silent isn't solving anything. Reply back, mane.",
  "{FI}. {LN} from {TH}, silence might be golden, but not when a response is expected. Communicate, mane.",
  "What happened to the follow-up, {FI}. {LN} at {TH}? Going ghost isn't helping, mane.",
  "{FI}. {LN} of {TH}, a reminder: communication is part of the job. Let’s get it right, mane.",
  "Dropping the ball on communication, {FI}. {LN} at {TH}? Pick it up and start replying, mane.",
  "It’s simple, {FI}. {LN} from {TH} – Reply. Don’t ignore. Can you manage that, mane?",
  "{FI}. {LN} at {TH}, people are waiting on your word. Time to deliver some replies, mane.",
  "Ignoring isn’t a professional trait, {FI}. {LN} of {TH}. Time to get back on track, mane.",
  "A shoutout to {FI}. {LN} at {TH}: Being responsive hasn’t gone out of style. Reply needed, mane.",
  "Where are you hiding, {FI}. {LN} from {TH}? The professional world awaits your replies, mane.",
];

const companyTweetTemplates = [
  "{TH}, what’s with the radio silence? People are waiting for your response. Time to engage, mane.",
  "Hello {TH}, seems like your reply button is broken. Better fix it quick, communications are key, mane.",
  "Customers expect better, {TH}. Leaving messages unanswered isn’t the way to go. Reply needed, mane.",
  "{TH}, your lack of response is becoming notable. Let’s not make this a trend. Get back to them, mane.",
  "Not hearing back from you not great, {TH}. What happened to customer service? Reply to your people, mane.",
  "{TH}, we know you're busy, but so are your customers. They deserve a response. Where’s the courtesy, mane?",
  "Hey {TH}, ignoring inquiries? That’s not professional. Time to step up your game and start replying, mane.",
  "Is anyone there at {TH}? Your community is looking for some answers. Communication is overdue, mane.",
  "{TH}, a friendly nudge: check your messages and start replying. It’s good manners, mane.",
  "Silence is not golden in customer service, {TH}. People expect replies, not radio silence. Fix this, mane.",
  "{TH}, your response rate is off the charts – the wrong way. Let’s bring it back to respectful levels, mane.",
  "What’s up, {TH}? Your replies are as missing as a ghost. It’s time to come back to life, mane.",
  "If replies were music, you’re currently on mute, {TH}. Time to turn the volume up and answer, mane.",
  "Customer service check for {TH}: You’ve got unread messages waiting. Let’s clear that inbox, mane.",
  "{TH}, avoiding replies? Pull up, address the queries, and show some respect to the folks, mane.",
  "Yo {TH}, leaving people on 'read' isn’t a cool move. How about some responses? Get to it, mane.",
  "{TH}, remember when you used to reply? Those were the good days. Bring them back, mane!",
  "A bit of advice for {TH} — people like it when you respond. Silence isn’t a strategy. Reply soon, mane.",
  "MIA on responses, {TH}? Your followers aren’t just tweeting for fun. They want answers, mane.",
  "{TH}, in case you missed it, replies are still in style. Start trending by answering your community, mane.",
  "Looks like {TH}’s replies are stuck in traffic. Time to hit the gas, clear the way, and respond, mane.",
  "Daily reminder for {TH}: those messages aren’t going to answer themselves. Time to get typing, mane.",
  "Hey {TH}, just checking if you’ve lost your way to the reply button. Need directions? Just hit '@', mane.",
  "{TH}, a ghost town for responses isn’t a good look. Populate your feed with replies, not just posts, mane.",
  "{TH}, it’s like your replies are on a holiday. Time to bring them back to work, mane.",
  "Echoing the masses, {TH}: Where are the replies? Your silence is louder than words, mane.",
  "We’re getting a 'not found' error on your responses, {TH}. This page definitely needs an update, mane.",
  "{TH}, your community called. They want some replies with their tweets. Start serving, mane.",
  "How about we switch things up, {TH}? Less ghosting, more replying. Let’s make it happen, mane.",
];

const replyTweetTemplates = [
  "Got ghosted, mane 👻? Visit {URL} and let us tweet at 'em for you. We got you boo (pun intended). #ghostmane",
  "Still waiting for a response? Don't wait in vain. Visit {URL} and take action. Let's tweet them together! #ghostmane",
  "It seems they've left you hanging. Click {URL} and we'll help send a reminder tweet. Don’t get ghosted! #ghostmane",
  "Not cool being ignored, right? Visit {URL} and we'll help you tweet at them. Stay visible, mane. #ghostmane",
  "Silence can be loud, huh? If no one’s replying, visit {URL} and we’ll help you make some noise. #ghostmane",
  "Hey, ignoring isn't a reply! If you feel ghosted, visit {URL}. Let's make some noise. #ghostmane",
  "Feeling overlooked? We notice you! Visit {URL} and let's tweet a reminder together. #ghostmane",
  "If silence was golden, you'd be rich! Feel ghosted? Visit {URL} to send a wake-up tweet. #ghostmane",
  "Waiting for a reply can be tiring. Energize with a visit to {URL} and let’s tweet at them. #ghostmane",
  "Seems they took 'ghosting' too seriously. Visit {URL} and let’s bring them back to reality. #ghostmane",
  "They missed your message, but we won’t. Visit {URL} if you’ve been ghosted. It’s tweeting time! #ghostmane",
  "Ghosted? Spooky! But we've got the remedy at {URL}. Let's tweet them. #ghostmane",
  "No reply yet? Let's change that. Visit {URL} and tweet through us. Ghosting ends here. #ghostmane",
  "Ghosting isn't a game. If you're tired of waiting, visit {URL} and we'll help tweet them. #ghostmane",
  "Ignored? We’ve got your back. Visit {URL} and let’s send them a friendly nudge. #ghostmane",
  "Hearing crickets? Let's make some noise. Visit {URL} to tweet at them with us. #ghostmane",
  "If ghosting were an Olympic sport, they'd take gold! Time to step up – visit {URL}. #ghostmane",
  "Playing 'hide and seek'? Stop playing. Visit {URL} and let's tweet at them. #ghostmane",
  "Where’s that reply? Seems missing. Navigate to {URL} and let's get you an answer. #ghostmane",
  "Echoing in the void? Not anymore. Visit {URL} and let’s get the tweets flowing. #ghostmane",
  "Waiting vanished into thin air? Not on our watch! Visit {URL} and let’s get you a reply. #ghostmane",
  "Invisible replies? Let’s fix that. Visit {URL} and we'll help bring them to light. #ghostmane",
  "Ghost town on your notifications? Let's populate it. Visit {URL} and start the convo. #ghostmane",
  "Crickets from your inbox? Time to tweet some noise. Visit {URL} and we'll help out. #ghostmane",
  "Radio silence isn’t cool. Visit {URL} and we'll tune into some replies together. #ghostmane",
  "Mute button hit? Let’s hit back with a tweet. Visit {URL} and say it loud. #ghostmane",
  "If being ignored was a sport, they’re champions. Time to train them with {URL}. #ghostmane",
  "Silence might be golden, but not when you’re waiting. Visit {URL} and let’s tweet. #ghostmane",
  "They think silence is an answer? Visit {URL} and let’s correct them with a tweet. #ghostmane",
  "Being ghosted? We’ve got the spirit to help. Visit {URL} and let’s tweet together. #ghostmane",
];

const determineTweetTemplate = ({
  url,
  lastName,
  firstInitial,
  twitterHandle,
}) => {
  const randomIndex = Math.floor(
    Math.random() * tweetTemplatesWithNames.length
  );
  const tweetTemplateWithName = tweetTemplatesWithNames[randomIndex];
  const tweetTemplateWithCompany = companyTweetTemplates[randomIndex];
  const replyTweet = replyTweetTemplates[randomIndex];

  if (url) {
    return replyTweet.replace("{URL}", url) + " " + "👻";
  } else if (lastName) {
    return (
      tweetTemplateWithName
        .replace("{FI}", firstInitial)
        .replace("{LN}", lastName)
        .replace("{TH}", twitterHandle) +
      " " +
      "Stop ghosting your applicants. \n#GhostMane"
    );
  } else {
    return tweetTemplateWithCompany.replace(
      "{TH}",
      twitterHandle + " " + "Stop ghosting your applicants. \n#GhostMane"
    );
  }
};

module.exports = {
  tweetTemplatesWithNames,
  companyTweetTemplates,
  determineTweetTemplate,
};
