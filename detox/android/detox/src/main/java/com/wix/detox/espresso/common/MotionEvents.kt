package com.wix.detox.espresso.common

import android.view.MotionEvent
import androidx.test.espresso.UiController
import androidx.test.espresso.action.MotionEvents

class MotionEvents {
    fun sendDown(uiController: UiController, x: Float, y: Float, precision: FloatArray): MotionEvent? {
        val downEvent = MotionEvents.obtainDownEvent(floatArrayOf(x, y), precision)
        uiController.injectMotionEvent(downEvent)
        return downEvent
    }
    fun sendDownSync(uiController: UiController, x: Float, y: Float, precision: FloatArray) = MotionEvents.sendDown(uiController, floatArrayOf(x, y), precision)
    fun obtainDownEvent(x: Float, y: Float, precision: FloatArray): MotionEvent? = MotionEvents.obtainDownEvent(floatArrayOf(x, y), precision)

    fun sendMovement(uiController: UiController, downEvent: MotionEvent, x: Float, y: Float) = MotionEvents.sendMovement(uiController, downEvent, floatArrayOf(x, y))

    fun sendCancel(uiController: UiController, downEvent: MotionEvent) = MotionEvents.sendCancel(uiController, downEvent)

    fun sendUp(uiController: UiController, downEvent: MotionEvent, x: Float, y: Float) = MotionEvents.sendUp(uiController, downEvent, floatArrayOf(x, y))

    companion object {
        val instance = MotionEvents()
    }
}
