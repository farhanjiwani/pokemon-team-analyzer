export const useUIStore = defineStore("ui", () => {
  type ToastActionType = {
    label: string;
    callback: () => void;
  };

  const message = ref("");
  const isVisible = ref(false);
  const action = ref<ToastActionType | null>(null);

  let timeout: ReturnType<typeof setTimeout>;

  function notify(msg: string, actionBtn?: ToastActionType) {
    const toastLifetime = actionBtn ? 8000 : 4000;

    // Reset
    isVisible.value = false;
    clearTimeout(timeout);

    // Update
    message.value = msg;
    action.value = actionBtn || null;

    // Trigger new one
    // nextTick ensures SRs will notice the change
    nextTick(() => {
      isVisible.value = true;
      // Visual toast hides after 8s, but SR content stays longer if needed
      timeout = setTimeout(() => {
        isVisible.value = false;
      }, toastLifetime);
    });
  }

  return { message, isVisible, action, notify };
});
