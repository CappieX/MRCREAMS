// MR.CREAMS Icon Utility - Central icon management
import { 
  // Core UI Icons
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  
  // Navigation Icons
  Add as AddIcon,
  List as ListIcon,
  BarChart as BarChartIcon,
  Lightbulb as LightbulbIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  
  // Emotion & Psychology Icons
  Psychology as PsychologyIcon,
  Favorite as HeartIcon,
  Mood as MoodIcon,
  EmojiEmotions as EmojiIcon,
  Insights as InsightsIcon,
  
  // Achievement & Gamification Icons
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  
  // Communication Icons
  People as PeopleIcon,
  Chat as ChatIcon,
  Share as ShareIcon,
  
  // Analytics Icons
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  
  // Action Icons
  Play as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  
  // Alternative Icons for missing ones
  Whatshot as AlternativeFireIcon,
  MilitaryTech as AlternativeTrophyIcon,
  AutoAwesome as MagicIcon,
  Security as ShieldIcon,
  Bolt as ZapIcon,
  DarkMode as MoonIcon,
  LightMode as SunIcon,
  Grade as AlternativeStarIcon,
  FavoriteBorder as HeartBorderIcon,
  
  // Additional useful icons
  Diamond as DiamondIcon,
  Grade as GradeIcon,
  GradeOutlined as GradeOutlinedIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
  StarOutline as StarOutlineIcon,
  StarPurple500 as StarPurpleIcon,
  StarRate as StarRateIcon,
  Stars as StarsIcon,
  StarTwoTone as StarTwoToneIcon
} from '@mui/icons-material';

// Central icon mapping for consistency and fallbacks
export const Icons = {
  // Core UI
  Dashboard: DashboardIcon,
  Menu: MenuIcon,
  Logout: LogoutIcon,
  Settings: SettingsIcon,
  Palette: PaletteIcon,
  
  // Navigation
  Add: AddIcon,
  List: ListIcon,
  BarChart: BarChartIcon,
  Lightbulb: LightbulbIcon,
  Save: SaveIcon,
  ArrowBack: ArrowBackIcon,
  
  // Emotion & Psychology
  Psychology: PsychologyIcon,
  Heart: HeartIcon,
  Mood: MoodIcon,
  Emoji: EmojiIcon,
  Insights: InsightsIcon,
  
  // Achievement & Gamification
  Trophy: TrophyIcon,
  Fire: FireIcon,
  Star: StarIcon,
  CheckCircle: CheckCircleIcon,
  Schedule: ScheduleIcon,
  TrendingUp: TrendingUpIcon,
  
  // Communication
  People: PeopleIcon,
  Chat: ChatIcon,
  Share: ShareIcon,
  
  // Analytics
  Analytics: AnalyticsIcon,
  Warning: WarningIcon,
  
  // Actions
  Play: PlayIcon,
  Edit: EditIcon,
  Delete: DeleteIcon,
  Refresh: RefreshIcon,
  
  // Alternative mappings for missing icons
  Crown: AlternativeTrophyIcon,
  Magic: MagicIcon,
  Shield: ShieldIcon,
  Zap: ZapIcon,
  Moon: MoonIcon,
  Sun: SunIcon,
  
  // Additional variants
  Diamond: DiamondIcon,
  Grade: GradeIcon,
  GradeOutlined: GradeOutlinedIcon,
  StarBorder: StarBorderIcon,
  StarHalf: StarHalfIcon,
  StarOutline: StarOutlineIcon,
  StarPurple: StarPurpleIcon,
  StarRate: StarRateIcon,
  Stars: StarsIcon,
  StarTwoTone: StarTwoToneIcon,
  HeartBorder: HeartBorderIcon,
  
  // Fallback alternatives
  AlternativeFire: AlternativeFireIcon,
  AlternativeTrophy: AlternativeTrophyIcon
};

// Safe icon component with fallback
export const SafeIcon = ({ iconName, fallbackIcon = 'Star', ...props }) => {
  const IconComponent = Icons[iconName] || Icons[fallbackIcon];
  
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found, using fallback`);
    return <FallbackIcon {...props} />;
  }
  
  return <IconComponent {...props} />;
};

// Fallback icon component for missing icons
export const FallbackIcon = (props) => (
  <span 
    style={{ 
      width: 24, 
      height: 24, 
      backgroundColor: '#ccc',
      borderRadius: '50%',
      display: 'inline-block',
      ...props.style
    }} 
    {...props}
  />
);

// Icon validation utility
export const validateIcon = (iconName) => {
  return Icons.hasOwnProperty(iconName);
};

// Get all available icon names
export const getAvailableIcons = () => {
  return Object.keys(Icons);
};

// Icon categories for organization
export const IconCategories = {
  UI: ['Dashboard', 'Menu', 'Logout', 'Settings', 'Palette'],
  Navigation: ['Add', 'List', 'BarChart', 'Lightbulb', 'Save', 'ArrowBack'],
  Emotion: ['Psychology', 'Heart', 'Mood', 'Emoji', 'Insights'],
  Achievement: ['Trophy', 'Fire', 'Star', 'CheckCircle', 'Schedule', 'TrendingUp'],
  Communication: ['People', 'Chat', 'Share'],
  Analytics: ['Analytics', 'Warning'],
  Actions: ['Play', 'Edit', 'Delete', 'Refresh']
};

export default Icons;
