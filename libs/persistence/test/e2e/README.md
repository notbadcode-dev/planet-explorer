# Testing E2E

End-to-end tests for Persistence layer (Spec 011).

## Overview

E2E tests validate the complete load/save/event cycle using Playwright (Spec 033 infrastructure).

**Status**: Placeholder (implementation deferred to Spec 033: Automated E2E Testing)

## Test Scenarios (Deferred)

### Scenario 1: Complete Challenge → Persist → Restart Session

**Setup**: Game at first session, player completes "Counting 101" challenge
**Action**: 
1. Player completes challenge (skill level: 0 → 1)
2. Game auto-saves via EventSaveCoordinator.onChallengeCompleted()
3. Player closes browser (simulated)
4. Game reloads
**Expected**: Skill level persists as 1

### Scenario 2: Complete Destination → Persist → Multi-Session

**Setup**: Player at moon destination, completes all missions
**Action**:
1. Player completes final mission
2. Game calls EventSaveCoordinator.onDestinationCompleted('moon')
3. Auto-save persists destination.completed = true
4. Player closes/reopens game
5. Load() restores destination as completed
**Expected**: Destination marked complete persists across sessions

### Scenario 3: Corrupted Data Recovery

**Setup**: localStorage contains corrupted JSON
**Action**:
1. Game loads (PersistenceService.load())
2. Deserialize applies permissive fallback
3. Valid skills restored, invalid fields skipped
**Expected**: Game boots without errors; valid progress recovers

## Implementation Details

### Framework
- Playwright (spec 033 infrastructure)
- Browser: Chromium/Firefox/WebKit
- Environment: GitHub Pages test deployment

### Test Harness
- Page navigation to deployed game
- Browser DevTools inspection (F12)
- localStorage inspection/manipulation
- Console error monitoring

### Coverage Target
- All 3 scenario types ✅
- Error cases (corrupted data, quota exceeded) ✅
- Multi-session persistence ✅
- Event coordination ✅

## Run Tests

Once Spec 033 (E2E infrastructure) is implemented:

```bash
npm run test:e2e
```

## Acceptance Criteria

- [ ] All 3 scenarios pass
- [ ] No console errors logged
- [ ] Data recovery works correctly
- [ ] No regressions in specs 001-010

---

**Deferred To**: Spec 033 (Automated E2E Testing via Playwright)
