# ⌨️ Typing Speed Test

A modern, interactive typing speed test application that measures your Words Per Minute (WPM), accuracy, and tracks your progress over time.

## ✨ Features

- **Multiple Difficulty Levels** - Easy, Medium, and Hard passages
- **Two Game Modes** - Timed (60 seconds) or Passage completion
- **Real-time Statistics** - Live WPM, Accuracy, and Time tracking
- **Visual Feedback** - Color-coded characters (correct/incorrect/current)
- **Personal Best Tracking** - Saves your highest score locally
- **First Visit Recognition** - Special messages for new users
- **Mistake Counter** - Tracks total incorrect inputs
- **Responsive Design** - Works on desktop and mobile devices

## 🚀 Live Demo

[DEMO LINK](https://candid-biscochitos-9ae432.netlify.app/)

## 📋 How to Use

1. **Select Difficulty** - Choose Easy, Medium, or Hard
2. **Choose Mode** - Timed (60s) or Passage (complete the text)
3. **Click "Start Typing Test"** - Begin the test
4. **Type the displayed text** - Click on the text area to focus
5. **View Results** - See your WPM, Accuracy, and total mistakes
6. **Track Progress** - Personal best is saved automatically

## 🎮 Game Modes

### Timed Mode (60s)

- Type as much as possible within 60 seconds
- WPM calculated based on time remaining
- Test ends when timer reaches zero

### Passage Mode

- Complete the entire passage accurately
- No time limit
- Test ends when all characters match

## 📊 Statistics Tracked

- **WPM** - Words Per Minute (5 characters = 1 word)
- **Accuracy** - Percentage of correctly typed characters
- **Characters** - Total characters typed
- **Incorrect Inputs** - Count of typing errors

## 💾 Data Storage

- Personal best saved in browser's localStorage
- First visit status tracked
- No external databases or servers required

## 🎨 Color Coding

- 🟢 **Green** - Correctly typed characters
- 🔴 **Red** - Incorrect characters
- 🟡 **Yellow** - Current typing position

## 🧪 Testing

To test the application:

1. Run with a local server
2. Try different difficulty levels
3. Complete tests in both modes
4. Check localStorage for saved data:
   ```javascript
   localStorage.getItem("typingPersonalBest");
   localStorage.getItem("hasVisitedBefore");
   ```

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Future Improvements

- [ ] Add sound effects for typing
- [ ] Leaderboard system
- [ ] Multiple language support
- [ ] Export test results
- [ ] Daily challenges
- [ ] Typing history graph

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is free to use for personal and educational purposes.

## 👨‍💻 Author

**M.Muneeb**

- Frontend Mentor Challenge Solution
- [View Challenge](https://www.frontendmentor.io/challenges/typing-speed-test)
