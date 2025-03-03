# Project Name: graph-from-llm

![Node.js](https://img.shields.io/badge/Node.js-v18.17.1-green) ![License](https://img.shields.io/badge/license-Apache%202.0-blue)

## 📖 About

**graph-from-llm** demonstrates how a generative AI tool can be used to automate the initial draft of a Semantic Web Ontology. The code in this project represents an initial prototype and would require additional refactoring to make it more flexible and adaptable to additional use case.

**Technologies Used**

| Type                 | Name        | Version |
| -------------------- | ----------- | ------- |
| Runtime              | Node.JS     | 18.17.1 |
| Module - Testing     | Vitest      | 2.1.5   |
| Module - Environment | dotenv      | 16.4.5  |
| Module - GenAI       | OpenAI      | 4.72.0  |
| LLM Model            | gpt-4o-mini | ---     |

**Use Case**

The current version of code explores the knowledge domain related to hand tool woodworking. It asks the LLM to define the wooden joints used to make projects, the operations required to make the joints, and the tools used to complete the operation.

Other topics could be explored by updating the "messages" javascript object in the index.js file and also updating the "responseSchema" object in the open-ai-chat-schema.js file to match.

The hand tool woodworking topic was selected because as a long time woodworking hobbyist I have a certain degree of subject matter expertise, which makes engineering prompts and assessing results more convenient. Also, the woodworking topic contains critical nuances in language that stem from historic and technological developments as well as cultural traditions. So, if an LLM can operated effectively within the woodworking knowledge domain, then it should have proven itself capable of adding value to any number of human activities.

## 📋 Future Work

- [ ] Additional unit tests for open-ai-chat.js
- [ ] Fix bug resulting in orphaned class due to domain/range object properties
- [ ] Add feature to merge duplicate classes based on alias names similarity
- [ ] Add feature to distguish between a true alias, i.e. synonym, and a parent or child class.
- [ ] Refactor to support configuration of different OpenAI Models
- [ ] Refactor to support configuration of different APIs, such as hugging face.
- [ ] Refactor to support configuratoin of different knowledge domains

## ⚡ Installation

Clone this repository and install dependencies:

```sh
git clone https://github.com/yourusername/your-repo.git
cd your-repo
npm install
```

## 🔧 Environment Variables

1. Using your own account, log into the [OpenAI API Keys](https://platform.openai.com/api-keys) page. Create a new key and copy it to your clipboard. Or use your own existing API Key.

2. In the same directory as the package.json file. Create a file name ".env.development.local".

   - **_NOTE: the word "development" refers to the NODE_ENV environment variable set by the "development" script in the package.json file._**

   - **_NOTE: the file created in this step is exclude from addition to the git repository via the git.ignore file. This prevents the OpenAPI key from being shared publicly._**

3. Add the following line to the env file created in the step above. Paste in you API key.

```env
OPENAI_API_KEY=<paste you API key here>
```

## 🚀 Usage

### Run Unit Tests

Enter the following command in at terminal prompt.

```sh
npm test
```

### Execute the Application

Enter the following command in at terminal prompt. Development is a name script in the package.json file.

```sh
npm run development
```

### Inspect Results

The current version of code produces a JSON file containg a Protege compatible JSON-LD formated Semantic Web Ontology. The best way to inspect the results is by opening the file in the [Protege](https://protege.stanford.edu/) application, which is a free application maintained by Standford University.

## 📜 License

This project is licensed under the Appache 2.0 License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions or feedback, contact:

- GitHub: [thomaspurk](https://github.com/thomaspurk)
- LinkedIn: [Thomas purk](https://linkedin.com/in/thomaspurk)
