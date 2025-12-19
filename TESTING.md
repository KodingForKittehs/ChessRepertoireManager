# Testing Guide for Calico Chess

This document provides comprehensive information about the testing setup and best practices for the Calico Chess project.

## Overview

Calico Chess uses different testing frameworks for frontend and backend:
- **Frontend**: Vitest with React Testing Library
- **Backend**: pytest

## Frontend Testing

### Tech Stack
- **Vitest**: Fast unit test framework for Vite projects
- **React Testing Library**: Testing utilities for React components
- **jsdom**: DOM implementation for Node.js
- **@testing-library/jest-dom**: Custom matchers for DOM assertions

### Running Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Writing Frontend Tests

Tests are located alongside their source files with `.test.tsx` or `.test.ts` extensions.

Example test structure:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const mockHandler = vi.fn()
    render(<MyComponent onClick={mockHandler} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockHandler).toHaveBeenCalled()
  })
})
```

### Best Practices
1. Test user interactions, not implementation details
2. Use `screen` queries from Testing Library
3. Prefer `getByRole` and `getByText` over `getByTestId`
4. Mock external dependencies using `vi.fn()` and `vi.mock()`
5. Keep tests focused and independent

## Backend Testing

### Tech Stack
- **pytest**: Python testing framework
- **pytest-cov**: Coverage plugin for pytest

### Running Tests

```bash
cd backend

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_chess_game.py

# Run specific test
pytest tests/test_chess_game.py::TestChessGame::test_game_initialization

# Run with coverage
pytest --cov=src

# Generate HTML coverage report
pytest --cov=src --cov-report=html
```

### Writing Backend Tests

Tests are located in the `tests/` directory with `test_*.py` naming convention.

Example test structure:
```python
import pytest
from src.my_module import MyClass

class TestMyClass:
    """Test cases for MyClass"""
    
    def test_initialization(self):
        """Test that class initializes correctly"""
        obj = MyClass()
        assert obj.value == 0
    
    def test_method(self):
        """Test specific method behavior"""
        obj = MyClass()
        result = obj.do_something()
        assert result == expected_value

@pytest.fixture
def sample_data():
    """Fixture providing test data"""
    return {'key': 'value'}

def test_with_fixture(sample_data):
    """Test using a fixture"""
    assert sample_data['key'] == 'value'
```

### Best Practices
1. Use descriptive test names that explain what is being tested
2. Follow AAA pattern: Arrange, Act, Assert
3. Use fixtures for shared test data
4. Keep tests independent and isolated
5. Use `pytest.mark` for test categorization

## Test Coverage Goals

- **Minimum coverage**: 70%
- **Target coverage**: 80%+
- Focus on critical paths and business logic
- Don't chase 100% coverage at the expense of test quality

## Continuous Integration

When setting up CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run Frontend Tests
  run: |
    cd frontend
    npm install
    npm test

- name: Run Backend Tests
  run: |
    cd backend
    pip install -r requirements.txt
    pytest --cov=src --cov-report=xml
```

## Common Issues and Solutions

### Frontend

**Issue**: Tests fail with "Cannot find module"
- **Solution**: Check import paths and ensure files exist

**Issue**: Tests timeout
- **Solution**: Increase timeout or check for unresolved promises

**Issue**: jsdom warnings
- **Solution**: These are often harmless but can be suppressed in setup file

### Backend

**Issue**: Import errors in tests
- **Solution**: Ensure `__init__.py` files exist and PYTHONPATH is set correctly

**Issue**: Tests pass individually but fail together
- **Solution**: Tests may have shared state; ensure proper cleanup

**Issue**: Coverage not detecting files
- **Solution**: Check `pytest.ini` configuration and source paths

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [pytest Documentation](https://docs.pytest.org/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Adding New Tests

When adding new features:
1. Write tests BEFORE or alongside implementation (TDD approach)
2. Ensure tests cover happy path and edge cases
3. Run tests locally before pushing
4. Review coverage reports to identify gaps
5. Update this guide if new testing patterns emerge
