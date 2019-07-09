package com.wix.detox.espresso.scroll

import android.view.MotionEvent
import androidx.test.espresso.UiController
import com.nhaarman.mockitokotlin2.*
import com.wix.detox.espresso.common.MotionEvents
import org.junit.Before
import org.junit.Test
import org.assertj.core.api.Assertions.assertThat
import java.lang.Exception
import java.lang.RuntimeException

class SyncedSwiperTest {

    val swipeStartTime = 1000L
    val perEventTime = 100L

    lateinit var uiController: UiController
    lateinit var downEvent: MotionEvent
    lateinit var motionEvents: MotionEvents
    lateinit var nowProvider: () -> Long

    @Before fun setUp() {
        uiController = mock()
        downEvent = mock {
            on { downTime }.doReturn(swipeStartTime)
        }
        motionEvents = mock {
            on { sendDown(any(), any(), any(), any()) }.doReturn(downEvent)
            on { sendMovement(any(), any(), any(), any()) }.doReturn(true)
            on { sendUp(any(), any(), any(), any()) }.doReturn(true)
        }
        nowProvider = mock {
            onGeneric { invoke() }.doReturn(swipeStartTime)
        }
    }

    @Test fun `should start by sending a 'down' event`() {
        uut().startAt(666f, 999f)
        verify(motionEvents).sendDown(eq(uiController), eq(666f), eq(999f), any())
    }

    @Test fun `should move by sending a movement event`() {
        val result: Boolean
        with(uut()) {
            startAt(0f, 0f)
            result = moveTo(111f, 222f)
        }
        verify(motionEvents).sendMovement(eq(uiController), eq(downEvent), eq(111f), eq(222f))
        assertThat(result).isTrue()
    }

    @Test fun `should cancel if movement fails`() {
        whenever(motionEvents.sendMovement(any(), any(), any(), any())).thenReturn(false)

        val result: Boolean
        with(uut()) {
            startAt(0f, 0f)
            result = moveTo(1f, 1f)
        }

        verify(motionEvents).sendCancel(eq(uiController), eq(downEvent))
        assertThat(result).isFalse()
    }

    @Test fun `should not cancel if movement succeeds`() {
        with(uut()) {
            startAt(0f, 0f)
            moveTo(1f, 1f)
        }
        verify(motionEvents, never()).sendCancel(any(), any())
    }

    @Test fun `should wait according to event's target time when moving`() {
        val expectedMoveEventTime = downEvent.downTime + perEventTime
        val waitTime = 11L

        with(uut()) {
            startAt(0f, 0f)

            whenever(nowProvider.invoke()).doReturn(expectedMoveEventTime - waitTime)
            moveTo(1f, 1f)
        }
        verify(uiController).loopMainThreadForAtLeast(eq(waitTime))
    }

    @Test fun `should not wait to event's target time if 10ms or lower`() {
        val expectedMoveEventTime = downEvent.downTime + perEventTime
        val waitTime = 10L

        with(uut()) {
            startAt(0f, 0f)

            whenever(nowProvider.invoke()).doReturn(expectedMoveEventTime - waitTime)
            moveTo(1f, 1f)
        }
        verify(uiController, never()).loopMainThreadForAtLeast(any())
    }

    @Test fun `should finish by sending an up event`() {
        with(uut()) {
            startAt(0f, 0f)
            moveTo(1f, 1f)
            finishAt(123f, 321f)
        }
        verify(motionEvents).sendUp(eq(uiController), eq(downEvent), eq(123f), eq(321f))
    }

    @Test fun `should cancel if finish (up event) fails`() {
        whenever(motionEvents.sendUp(any(), any(), any(), any())).doReturn(false)
        with(uut()) {
            startAt(0f, 0f)
            moveTo(1f, 1f)
            finishAt(2f, 2f)
        }
        verify(motionEvents).sendCancel(eq(uiController), eq(downEvent))
    }

    @Test fun `should not cancel if finish (up event) succeeds`() {
        with(uut()) {
            startAt(0f, 0f)
            moveTo(1f, 1f)
            finishAt(2f, 2f)
        }
        verify(motionEvents, never()).sendCancel(any(), any())
    }

    @Test fun `should recycle down event`() {
        with(uut()) {
            startAt(0f, 0f)
            moveTo(1f, 1f)
            finishAt(2f, 2f)
        }
        verify(downEvent).recycle()
    }

    @Test fun `should recycle down event even when an error occurs`() {
        whenever(motionEvents.sendUp(any(), any(), any(), any())).doThrow(RuntimeException())
        with(uut()) {
            startAt(0f, 0f)
            moveTo(1f, 1f)
            try {
                finishAt(2f, 2f)
            } catch (ex: Exception) {
            }
        }
        verify(downEvent).recycle()
    }

    @Test fun `should wait for android to clear potential pressed-on states in views`() {
        val androidPressedOnDuration = 314
        with(uut(androidPressedOnDuration)) {
            startAt(0f, 0f)
            finishAt(2f, 2f)
        }
        verify(uiController).loopMainThreadForAtLeast(androidPressedOnDuration.toLong())
    }

    @Test fun `should not wait for android to clear pressed-on if duration is 0`() {
        with(uut(androidPressedOnDuration = 0)) {
            startAt(0f, 0f)
            finishAt(2f, 2f)
        }
        verify(uiController, never()).loopMainThreadForAtLeast(any())
    }

    private fun uut() = SyncedSwiper(uiController, perEventTime, motionEvents, 0, nowProvider)
    private fun uut(androidPressedOnDuration: Int) = SyncedSwiper(uiController, perEventTime, motionEvents, androidPressedOnDuration, nowProvider)
}
