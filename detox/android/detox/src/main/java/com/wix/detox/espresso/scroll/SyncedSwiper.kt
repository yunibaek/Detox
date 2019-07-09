package com.wix.detox.espresso.scroll

import android.os.SystemClock
import android.util.Log
import android.view.MotionEvent
import android.view.ViewConfiguration
import androidx.test.espresso.UiController
import com.wix.detox.espresso.common.MotionEvents

private const val LOG_TAG = "DetoxSyncedSwipeExec"
private val PRECISION = floatArrayOf(1f, 1f)

/**
 * Sync'ed implementation of a [Swiper] - i.e. makes sure each step is
 * backed by proper delays when finished.
 *
 * @see DetoxSwipe
 */
class SyncedSwiper @JvmOverloads constructor(
        private val uiController: UiController,
        private val perMotionTimeMS: Long,
        private val motionEvents: MotionEvents = MotionEvents.instance,
        private val androidPressedOnDuration: Int = ViewConfiguration.getPressedStateDuration(),
        private val nowProvider: () -> Long = { SystemClock.uptimeMillis() })
    : Swiper {

    private lateinit var downEvent: MotionEvent

    private var targetTime: Long = -1L

    override fun startAt(touchX: Float, touchY: Float) {
        downEvent = motionEvents.sendDown(uiController, touchX, touchY, PRECISION)!!
        targetTime = downEvent.downTime
    }

    override fun moveTo(targetX: Float, targetY: Float): Boolean {
        if (!motionEvents.sendMovement(uiController, downEvent, targetX, targetY)) {
            Log.e(LOG_TAG, "Injection of move event as part of the scroll failed. Sending cancel event.")
            motionEvents.sendCancel(uiController, downEvent)
            return false
        }

        syncMovement()
        return true
    }

    override fun finishAt(releaseX: Float, releaseY: Float) {
        try {
            if (!motionEvents.sendUp(uiController, downEvent, releaseX, releaseY)) {
                Log.e(LOG_TAG, "Injection of up event as part of the scroll failed. Sending cancel event.")
                motionEvents.sendCancel(uiController, downEvent)
            }
        } finally {
            downEvent.recycle()
        }

        syncRelease()
    }

    private fun syncMovement() {
        targetTime += perMotionTimeMS

        val timeLeft = targetTime - nowProvider()
        if (timeLeft > 10) {
            uiController.loopMainThreadForAtLeast(timeLeft)
        }
    }

    private fun syncRelease() {
        // Ensures that all child views leave the pressed-on state, if in effect.
        // This is paramount for having consequent tap-events registered properly.
        if (androidPressedOnDuration > 0) {
            uiController.loopMainThreadForAtLeast(androidPressedOnDuration.toLong())
        }
    }
}
