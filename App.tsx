import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

const colors = {
  background: '#FAFAF8',
  surface: '#FFFFFF',
  text: '#252822',
  secondary: '#656A60',
  border: '#E3E6DE',
  subtle: '#F0F2EC',
  lime: '#D4EF79',
  limeDark: '#40551B',
};

type Tab = 'trip' | 'routes' | 'profile';

type FamilyMember = {
  id: string;
  name: string;
  age: number | null;
  childStories: boolean;
};

function RouteLogo() {
  return (
    <View style={styles.logoSymbol} accessible={false}>
      <View style={styles.logoRoad} />
      <View style={styles.logoStart} />
      <View style={styles.logoEnd} />
    </View>
  );
}

function ActionButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('trip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberAge, setMemberAge] = useState('');
  const [isChild, setIsChild] = useState(false);

  function buildRoute() {
    if (!from.trim() || !to.trim()) {
      Alert.alert(
        'Укажи маршрут',
        'Заполни начальную и конечную точки.',
      );
      return;
    }

    Alert.alert(
      `${from.trim()} → ${to.trim()}`,
      'Форма готова. Расчёт маршрута подключим следующим этапом.',
    );
  }

  function swapPlaces() {
    setFrom(to);
    setTo(from);
  }

  function openMemberForm() {
    setMemberName('');
    setMemberAge('');
    setIsChild(false);
    setShowMemberForm(true);
  }

  function addMember() {
    const name = memberName.trim();
    const age = Number(memberAge);

    if (!name) {
      Alert.alert('Укажи имя', 'Как зовут участника семьи?');
      return;
    }

    if (
      isChild &&
      (!/^\d{1,2}$/.test(memberAge.trim()) ||
        age < 1 ||
        age > 17)
    ) {
      Alert.alert(
        'Проверь возраст',
        'Укажи возраст ребёнка от 1 до 17 лет.',
      );
      return;
    }

    setFamily((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        name,
        age: isChild ? age : null,
        childStories: isChild,
      },
    ]);

    setShowMemberForm(false);
  }

  function updateChildStories(id: string, enabled: boolean) {
    setFamily((current) =>
      current.map((member) =>
        member.id === id
          ? { ...member, childStories: enabled }
          : member,
      ),
    );
  }

  function removeMember(member: FamilyMember) {
    Alert.alert(
      'Удалить участника?',
      `${member.name} будет удалён из списка семьи.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () =>
            setFamily((current) =>
              current.filter((item) => item.id !== member.id),
            ),
        },
      ],
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.app}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <RouteLogo />
            <Text style={styles.wordmark}>по пути</Text>
          </View>

          {tab === 'trip' && (
            <>
              <Text style={styles.title}>Куда отправимся?</Text>
              <Text style={styles.intro}>
                Истории о местах на твоём маршруте.
              </Text>

              <View style={styles.routeCard}>
                <View style={styles.routeField}>
                  <View style={styles.startDot} />

                  <View style={styles.fieldContent}>
                    <Text style={styles.fieldLabel}>Откуда</Text>
                    <TextInput
                      accessibilityLabel="Откуда"
                      placeholder="Город или адрес"
                      placeholderTextColor={colors.secondary}
                      value={from}
                      onChangeText={setFrom}
                      autoCapitalize="words"
                      style={styles.routeInput}
                    />
                  </View>
                </View>

                <View style={styles.separatorRow}>
                  <View style={styles.fieldSeparator} />

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Поменять начало и конец маршрута"
                    onPress={swapPlaces}
                    style={({ pressed }) => [
                      styles.swapButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.swapIcon}>⇅</Text>
                  </Pressable>
                </View>

                <View style={styles.routeField}>
                  <View style={styles.destinationDot} />

                  <View style={styles.fieldContent}>
                    <Text style={styles.fieldLabel}>Куда</Text>
                    <TextInput
                      accessibilityLabel="Куда"
                      placeholder="Город или адрес"
                      placeholderTextColor={colors.secondary}
                      value={to}
                      onChangeText={setTo}
                      autoCapitalize="words"
                      returnKeyType="done"
                      onSubmitEditing={buildRoute}
                      style={styles.routeInput}
                    />
                  </View>
                </View>
              </View>

              <ActionButton
                title="Найти маршрут"
                onPress={buildRoute}
              />

              <Text style={styles.formNote}>
                Сейчас доступен ввод точек. Поиск адресов и карту
                подключим позже.
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Перед поездкой
                </Text>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setTab('profile')}
                  style={({ pressed }) => [
                    styles.settingsRow,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.rowContent}>
                    <Text style={styles.rowTitle}>Твоя семья</Text>
                    <Text style={styles.rowDescription}>
                      Участники и настройки детских историй
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              </View>

              <View style={styles.infoBlock}>
                <View style={styles.infoMark} />
                <Text style={styles.infoText}>
                  После выбора маршрута здесь появятся места
                  и истории по дороге.
                </Text>
              </View>
            </>
          )}

          {tab === 'routes' && (
            <>
              <Text style={styles.title}>Маршруты</Text>
              <Text style={styles.intro}>
                Поездки, к которым хочется вернуться.
              </Text>

              <View style={styles.emptyState}>
                <View style={styles.emptyLogo}>
                  <RouteLogo />
                </View>

                <Text style={styles.emptyTitle}>
                  Здесь пока пусто
                </Text>
                <Text style={styles.emptyDescription}>
                  Сохранённые маршруты появятся здесь, когда
                  подключим их создание и хранение.
                </Text>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setTab('trip')}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.secondaryButtonText}>
                    Перейти к поездке
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          {tab === 'profile' && (
            <>
              <Text style={styles.title}>Профиль</Text>
              <Text style={styles.intro}>
                Всё для поездок твоей семьи.
              </Text>

              <View style={styles.ownerCard}>
                <View style={styles.ownerAvatar}>
                  <Text style={styles.ownerInitial}>Я</Text>
                </View>

                <View style={styles.rowContent}>
                  <Text style={styles.rowTitle}>Твой профиль</Text>
                  <Text style={styles.rowDescription}>
                    Организатор семейных поездок
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Моя семья</Text>
                <Text style={styles.sectionDescription}>
                  Детские истории настраивает родитель
                  отдельно для каждого ребёнка.
                </Text>

                {family.length === 0 ? (
                  <View style={styles.familyEmpty}>
                    <Text style={styles.rowTitle}>
                      Добавь тех, с кем путешествуешь
                    </Text>
                    <Text style={styles.rowDescription}>
                      Взрослого или ребёнка — список можно
                      изменить в любой момент.
                    </Text>
                  </View>
                ) : (
                  family.map((member) => (
                    <View
                      key={member.id}
                      style={styles.memberCard}
                    >
                      <View style={styles.memberHeader}>
                        <View style={styles.memberAvatar}>
                          <Text style={styles.memberInitial}>
                            {member.name.charAt(0).toUpperCase()}
                          </Text>
                        </View>

                        <View style={styles.rowContent}>
                          <Text style={styles.rowTitle}>
                            {member.name}
                          </Text>
                          <Text style={styles.rowDescription}>
                            {member.age === null
                              ? 'Взрослый'
                              : `Ребёнок · возраст: ${member.age}`}
                          </Text>
                        </View>

                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Удалить участника ${member.name}`}
                          onPress={() => removeMember(member)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeIcon}>×</Text>
                        </Pressable>
                      </View>

                      {member.age !== null && (
                        <View style={styles.childSettings}>
                          <View style={styles.rowContent}>
                            <Text style={styles.settingTitle}>
                              Детские истории
                            </Text>
                            <Text style={styles.rowDescription}>
                              Предпочтение для этого профиля
                            </Text>
                          </View>

                          <Switch
                            accessibilityLabel={`Детские истории для ${member.name}`}
                            value={member.childStories}
                            onValueChange={(value) =>
                              updateChildStories(member.id, value)
                            }
                            trackColor={{
                              false: '#D9DDD3',
                              true: colors.lime,
                            }}
                            thumbColor={colors.text}
                            ios_backgroundColor="#D9DDD3"
                          />
                        </View>
                      )}
                    </View>
                  ))
                )}

                <ActionButton
                  title="Добавить участника"
                  onPress={openMemberForm}
                />
              </View>

              <Text style={styles.formNote}>
                Это прототип: участники сохраняются только
                до перезапуска приложения. Авторизация,
                родительский доступ и подбор историй ещё
                не подключены.
              </Text>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <View style={styles.tabBarContent}>
          {([
            ['trip', 'Поездка'],
            ['routes', 'Маршруты'],
            ['profile', 'Профиль'],
          ] as const).map(([key, label]) => (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === key }}
              onPress={() => setTab(key)}
              style={({ pressed }) => [
                styles.tab,
                tab === key && styles.activeTab,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  tab === key && styles.activeTabLabel,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Modal
        visible={showMemberForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMemberForm(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalSheet}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Участник семьи
                </Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Закрыть"
                  onPress={() => setShowMemberForm(false)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeIcon}>×</Text>
                </Pressable>
              </View>

              <Text style={styles.inputLabel}>Имя</Text>
              <TextInput
                accessibilityLabel="Имя участника"
                value={memberName}
                onChangeText={setMemberName}
                placeholder="Как зовут?"
                placeholderTextColor={colors.secondary}
                maxLength={40}
                autoCapitalize="words"
                style={styles.formInput}
              />

              <View style={styles.childToggle}>
                <Text style={styles.settingTitle}>
                  Это ребёнок
                </Text>
                <Switch
                  accessibilityLabel="Это ребёнок"
                  value={isChild}
                  onValueChange={setIsChild}
                  trackColor={{
                    false: '#D9DDD3',
                    true: colors.lime,
                  }}
                  thumbColor={colors.text}
                  ios_backgroundColor="#D9DDD3"
                />
              </View>

              {isChild && (
                <>
                  <Text style={styles.inputLabel}>
                    Возраст ребёнка
                  </Text>
                  <TextInput
                    accessibilityLabel="Возраст ребёнка"
                    value={memberAge}
                    onChangeText={setMemberAge}
                    placeholder="От 1 до 17 лет"
                    placeholderTextColor={colors.secondary}
                    keyboardType="number-pad"
                    maxLength={2}
                    style={styles.formInput}
                  />
                  <Text style={styles.ageNote}>
                    Для нового детского профиля включим
                    настройку детских историй.
                  </Text>
                </>
              )}

              <ActionButton
                title="Добавить"
                onPress={addMember}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 12,
    paddingBottom: 32,
  },
  content: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },

  // Логотип: две точки и соединяющая их дорога.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 40,
  },
  logoSymbol: {
    width: 34,
    height: 34,
  },
  logoRoad: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: colors.text,
    borderBottomWidth: 0,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  logoStart: {
    position: 'absolute',
    bottom: 1,
    left: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.text,
  },
  logoEnd: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.lime,
    borderWidth: 2,
    borderColor: colors.text,
  },
  wordmark: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },

  title: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '600',
    color: colors.text,
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.secondary,
    marginTop: 10,
    marginBottom: 28,
  },
  routeCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 16,
  },
  routeField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 15,
  },
  startDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.text,
    backgroundColor: colors.lime,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    color: colors.secondary,
    marginBottom: 5,
  },
  routeInput: {
    fontSize: 17,
    color: colors.text,
    paddingVertical: 5,
    minHeight: 34,
  },
  separatorRow: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 28,
  },
  fieldSeparator: {
    height: 1,
    backgroundColor: colors.border,
    flex: 1,
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  swapIcon: {
    fontSize: 24,
    color: colors.text,
  },
  button: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: colors.lime,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.65,
  },
  formNote: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.secondary,
    marginTop: 14,
  },
  section: {
    marginTop: 34,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.secondary,
    marginBottom: 20,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '500',
    color: colors.text,
  },
  rowDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.secondary,
    marginTop: 4,
  },
  chevron: {
    fontSize: 28,
    color: colors.secondary,
  },
  infoBlock: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoMark: {
    width: 4,
    height: 35,
    borderRadius: 2,
    backgroundColor: colors.lime,
    marginTop: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.secondary,
  },

  emptyState: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyLogo: {
    backgroundColor: colors.subtle,
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
  },
  emptyDescription: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    color: colors.secondary,
    marginTop: 10,
    maxWidth: 300,
  },
  secondaryButton: {
    marginTop: 24,
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.subtle,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },

  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerInitial: {
    fontSize: 19,
    fontWeight: '500',
    color: colors.limeDark,
  },
  familyEmpty: {
    backgroundColor: colors.subtle,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  memberCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    fontSize: 17,
    color: colors.text,
    fontWeight: '500',
  },
  removeButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 26,
    color: colors.secondary,
  },
  childSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginTop: 16,
  },
  settingTitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    flexShrink: 1,
  },

  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 18,
  },
  tabBarContent: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  tab: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: colors.subtle,
  },
  tabLabel: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: 'center',
  },
  activeTabLabel: {
    fontWeight: '600',
    color: colors.text,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(20, 24, 18, 0.35)',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
  },
  formInput: {
    minHeight: 54,
    fontSize: 17,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 18,
  },
  childToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
    minHeight: 44,
  },
  ageNote: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.secondary,
    marginBottom: 22,
  },
});