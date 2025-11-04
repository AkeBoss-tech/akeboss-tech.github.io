---
title: "Grokipedia API"
excerpt: "A comprehensive Python and JavaScript/TypeScript client library for accessing Grokipedia's vast knowledge base"
image: "/images/portfolio/grokipedia-api/hero.png"
collection: portfolio
rank: 2
---

<img src='/images/portfolio/grokipedia-api/hero.png' width='100%' align='center'>

[Grokipedia](https://grokipedia.com/) is an incredible open-source knowledge base that aims to be a comprehensive collection of all human knowledge. When I first discovered it, I was immediately impressed by the scope and quality of the content. However, I quickly realized that while the website itself was powerful, there was **no official API package** available for developers to easily integrate Grokipedia into their Python or JavaScript projects. This gap presented a perfect opportunity to create something valuable for the developer community.

---

## Why hasn't this been done before?

Building a robust API client library from scratch is more complex than it might initially appear. It requires careful consideration of:
- **Error handling** for various edge cases and API failures
- **Rate limiting** to respect server resources
- **Caching** mechanisms to reduce unnecessary API calls
- **Async support** for performance in concurrent operations
- **Type safety** with proper TypeScript definitions
- **Cross-platform compatibility** between Python and JavaScript ecosystems

I decided to tackle both Python and JavaScript/TypeScript implementations simultaneously, ensuring feature parity between the two while respecting the unique conventions and best practices of each ecosystem.

---

## Building a Developer-First Solution

The core philosophy behind Grokipedia API is to make accessing Grokipedia's content as simple and intuitive as possible. I designed the library with developer experience in mind, focusing on clean APIs, comprehensive error handling, and excellent documentation.

### Python Implementation

The Python version supports both synchronous and asynchronous operations:

```python
from grokipedia_api import GrokipediaClient

client = GrokipediaClient()
results = client.search("Python programming")
page = client.get_page("United_Petroleum")
```

For high-performance applications, the async client enables concurrent operations:

```python
from grokipedia_api import AsyncGrokipediaClient, get_many_pages

async with AsyncGrokipediaClient() as client:
    pages = await get_many_pages(["Python", "JavaScript", "Rust"])
```

### JavaScript/TypeScript Implementation

The JavaScript version includes full TypeScript support out of the box:

```typescript
import { GrokipediaClient } from 'grokipedia-api';

const client = new GrokipediaClient();
const results = await client.search('machine learning', 20);
const page = await client.getPage('United_Petroleum', true);
```

Both implementations feature:
- **Automatic retries** with exponential backoff
- **Rate limit detection and handling**
- **Built-in caching** to reduce API calls
- **Comprehensive error types** for different failure scenarios
- **Structured data models** with proper typing

---

## Comprehensive Example Scripts

Understanding that developers learn best through examples, I created a comprehensive set of example scripts demonstrating various use cases. The examples directory includes:

- **Basic usage examples** for both Python and JavaScript
- **Async/await patterns** for concurrent operations
- **MCP server integration** for AI agent workflows
- **CLI tool examples** for command-line usage

One of the most ambitious examples I created is `scrape_all_pages.py` - a powerful script designed to scrape all of Grokipedia's content (~1 million pages). This script demonstrates:

- **Intelligent discovery strategies** using broad search queries and pagination
- **Concurrent async operations** with configurable worker pools
- **Progress tracking and resume capability** for long-running operations
- **Rate limit handling** to respect server resources
- **Robust error handling** for network failures and API errors

The script uses a combination of search strategies (single letters, common prefixes, numbers) to discover page slugs, then efficiently scrapes them in batches with proper rate limiting. This example showcases the real-world power of the async client and demonstrates best practices for large-scale data collection.

---

## The Technology Stack

To deliver a production-ready library, I carefully selected technologies that provide reliability, performance, and developer experience:

**Python:**
- **httpx** for synchronous HTTP requests
- **aiohttp** for async operations
- **pydantic** for data validation and type safety
- **click** for CLI functionality
- **pytest** for comprehensive testing

**JavaScript/TypeScript:**
- **TypeScript** for type safety and developer experience
- **axios** for HTTP requests
- **jest** for testing
- **ESLint & Prettier** for code quality

**Infrastructure:**
- **PyPI** for Python package distribution
- **npm** for JavaScript package distribution
- **GitHub Actions** for CI/CD
- **Comprehensive documentation** with examples

---

## Impact and Adoption

The library has been well-received by the developer community. Within just **3 days of release**, the Python package achieved **400 downloads** on PyPI, demonstrating immediate developer interest and need for this solution.

<div style="text-align: center; margin: 2rem 0;">
  <a href="https://pypistats.org/packages/grokipedia-api" target="_blank">
    <img src="https://img.shields.io/pypi/dm/grokipedia-api?label=PyPI%20Downloads&style=for-the-badge" alt="PyPI Downloads">
  </a>
</div>

The project is actively maintained with regular updates, bug fixes, and feature additions based on community feedback.

---

## Resources and Links

<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin: 2rem 0;">
  <a href="https://github.com/AkeBoss-tech/grokipedia-api" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub Repository">
  </a>
  <a href="https://pypi.org/project/grokipedia-api/" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/PyPI-Package-blue?style=for-the-badge&logo=pypi" alt="PyPI Package">
  </a>
  <a href="https://www.npmjs.com/package/grokipedia-api" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/npm-Package-red?style=for-the-badge&logo=npm" alt="npm Package">
  </a>
</div>

**Key Links:**
- [PyPI Package](https://pypi.org/project/grokipedia-api/)
- [npm Package](https://www.npmjs.com/package/grokipedia-api?activeTab=readme)
- [GitHub Repository](https://github.com/AkeBoss-tech/grokipedia-api)
- [PyPI Stats](https://pypistats.org/packages/grokipedia-api)
- [Grokipedia Website](https://grokipedia.com/)

---

## Lessons Learned

This project taught me valuable lessons about:
- **Package distribution** across multiple platforms (PyPI and npm) It's my first ever package, and I didn't realize how easy it would be to make.
- **Cross-language development** and maintaining feature parity
- **API design** that feels natural in both Python and JavaScript
- **Documentation** that serves both beginners and advanced users
- **Community engagement** and responding to user feedback

The success of this project demonstrates that identifying gaps in developer tooling and filling them with well-designed solutions can have meaningful impact, even for niche use cases. Sometimes the most valuable contributions are the ones that make powerful tools more accessible to everyone.

