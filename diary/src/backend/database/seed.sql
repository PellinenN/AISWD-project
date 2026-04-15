-- Seed data for moods
INSERT OR IGNORE INTO moods (name) VALUES ('Happy');
INSERT OR IGNORE INTO moods (name) VALUES ('Tired');
INSERT OR IGNORE INTO moods (name) VALUES ('Depressed');
INSERT OR IGNORE INTO moods (name) VALUES ('Bored');
INSERT OR IGNORE INTO moods (name) VALUES ('Sad');
INSERT OR IGNORE INTO moods (name) VALUES ('Stressed');
INSERT OR IGNORE INTO moods (name) VALUES ('Content');
INSERT OR IGNORE INTO moods (name) VALUES ('Calm');
INSERT OR IGNORE INTO moods (name) VALUES ('Anxious');
INSERT OR IGNORE INTO moods (name) VALUES ('Excited');
INSERT OR IGNORE INTO moods (name) VALUES ('Angry');

-- Seed data for suggestions
-- Happy suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 1, 'Take a moment and write down what made you feel good today. Reflecting on positive moments can boost your mood!');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 1, 'Consider sharing your happiness with a friend or loved one. Social connections can enhance your positive feelings!');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('excited', NULL, 'Channel your excitement into a creative project or activity you enjoy. It can help you make the most of your positive energy!');
-- Tired suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 2, 'It’s okay to feel tired. Consider taking a short break or practicing some deep breathing exercises to recharge your energy.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 2, 'Take a moment and breathe, sit down for a moment and drink something warm. It can help you relax and regain some energy.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('tired', NULL, 'If you’re feeling tired, it might be a good idea to prioritize rest. Consider taking a nap or going to bed early tonight to help your body recover!');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('exhausted', NULL, 'Prioritize self-care and rest, make a checklist of things you need to finish today and see if you can delegate or postpone any non-essential tasks.');
-- Depressed suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 3, 'It’s okay to feel down sometimes. Try to describe your feelings in more detail in your journal. Sometimes putting emotions into words can help you understand them better.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 3, 'Try writing a letter to your depression, expressing how it makes you feel and what you wish it would do differently. This can be a therapeutic way to externalize your feelings and gain perspective.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('depressed', NULL, 'If you’re feeling depressed, it’s important to reach out for support. Consider talking to a trusted friend, family member, or mental health professional about how you’re feeling. You don’t have to go through this alone!');
-- Bored suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 4, 'Feeling bored? Try writing about a food you have been craving lately. Describe its taste, texture, and why you enjoy it. This can be a fun way to spark your creativity and distract from boredom');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 4, 'Consider writing about a place you would like to visit someday. Describe the sights, sounds, and experiences you imagine having there. This can be a great way to escape boredom and inspire your imagination!');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('bored', NULL, 'If you’re feeling bored, try a creativity excercise, try describing what a color would look like as a person, what do they do for work? what do they wear?');
-- Sad suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 5, 'It is important to acknowledge and feel your sadness. Try sitting with them for a moment, and write about what you think might be causing these feelings. Sometimes understanding the root of our emotions can help us process them better.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 5, 'Consider writing a letter to someone you miss or have lost. Expressing your feelings and memories can be a therapeutic way to cope with sadness and honor those who are important to you.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('sad', NULL, 'If you’re feeling sad, it’s important to take care of yourself. Consider doing something comforting, like taking a warm bath, listening to a podcast you enjoy, or watching a comfort show. Take this time to nurture yourself and allow yourself to feel your emotions without judgment.');
-- Stressed suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 6, 'If you’re feeling stressed, try taking a moment to write down what’s on your mind. Sometimes putting your worries into words can help you gain perspective and find solutions.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 6, 'Break down your stressors into smaller, manageable tasks. Write a to-do list and prioritize what needs to be done. This can help you feel more in control and reduce feelings of overwhelm.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('stressed', NULL, 'Consider taking a break and doing something relaxing, like going for a walk, practicing deep breathing exercises, or listening to calming music. Taking care of your mental health is important when you’re feeling stressed!');
-- Content suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 7, 'Enjoy this peaceful moment, and take a moment to write about what feels good about today.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 7, 'Reflect on what things made it possible for you to feel content.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('content', NULL, 'Lean into this feeling and let your thoughts wander, write about anything that comes to mind.');
-- Calm suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 8, 'Take a moment to appreciate this calm moment. Write about what you are grateful for today.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 8, 'Consider writing about a peaceful place you have been to or would like to visit. Describe the sights, sounds, and feelings you associate with that place. This can help you cultivate a sense of calm and relaxation.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('calm', NULL, 'If you’re feeling calm, try writing about a happy memory or a moment that made you smile. This can help you savor the positive feelings and create a sense of joy in the present moment!');
-- Anxious suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 9, 'If you’re feeling anxious, try writing down your worries and fears. Sometimes putting them into words can help you gain perspective and find ways to cope with them.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 9, 'Try to take a moment to calm down, take some deep breaths, and write about what you think might be causing your anxiety. Understanding the root of your feelings can help you find ways to manage them better.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('anxious', NULL, 'Consider writing about a time when you overcame a difficult situation or challenge. Reflecting on your past successes can help boost your confidence and reduce feelings of anxiety!');
-- Excited suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 10, 'Channel your excitement into a creative project or activity you enjoy. It can help you make the most of your positive energy!');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 10, 'Consider sharing your excitement with a friend or loved one. Social connections can enhance your positive feelings!');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('excited', NULL, 'If you’re feeling excited, try writing about what you’re looking forward to or what’s making you feel this way. This can help you savor the positive feelings and create a sense of joy in the present moment!');
-- Angry suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 11, 'If you’re feeling angry, try writing down what’s making you feel this way. Sometimes putting your frustrations into words can help you gain perspective and find ways to cope with them.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES (NULL, 11, 'Consider writing a letter to someone you’re angry with (but don’t send it). Expressing your feelings and frustrations can be a therapeutic way to process your anger and gain perspective on the situation.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('angry', NULL, 'Try taking a moment to calm down, take some deep breaths, and write about what you think might be causing your anger. Understanding the root of your feelings can help you find ways to manage them better!');

-- Universal Keyword suggestions
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('anxious', NULL, 'Try grounding yourself by naming five things you can see.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('confused', NULL, 'Write down the questions swirling in your mind — clarity often follows.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('lost', NULL, 'Reflect on one small step you can take next.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('angry', NULL, 'Pause and breathe deeply before reacting.');
INSERT OR IGNORE INTO suggestions (trigger_keyword, mood_id, text)
VALUES ('happy', NULL, 'Capture this moment so you can revisit it later.');